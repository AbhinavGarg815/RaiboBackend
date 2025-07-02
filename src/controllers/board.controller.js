import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { Board } from '../models/board.model.js';
import { Product } from '../models/product.model.js';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Image } from '../models/images.model.js';
import { Invite } from '../models/invite.model.js';
import { mapRaiBoardInviteToResponse } from '../mappers/boardInvite.mapper.js';

const getBoards = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const boards = await Board.find({
        $or: [
            { user_id: userId },
            { 'collaborators.id': userId }
        ],
        isDeleted: false
    });

    const raiBoards = await Promise.all(boards.map(async (board) => ({
        id: board._id,
        name: board.name,
        description: board.description,
        products: await populateBoardProducts(board.products),
        textElements: populateBoardTextElements(board.textElements),
        collaborators: await populateBoardCollaborators(board.collaborators),
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        isPublic: board.isPublic,
        settings: board.settings
    })));
    res.status(200).json(new ApiResponse(200, raiBoards, "Boards fetched successfully"));
});

const getBoardById = asyncHandler(async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user._id;

    const board = await Board.findOne({
        _id: boardId,
        $or: [
            { 'collaborators.id': userId },
            { collaborators: userId }
        ],
        isDeleted: false
    });

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    const populatedProducts = await populateBoardProducts(board.products);
    const populatedTextElements = populateBoardTextElements(board.textElements);
    const populatedCollaborators = await populateBoardCollaborators(board.collaborators);

    const raiBoard = {
        id: board._id,
        name: board.name,
        description: board.description,
        products: populatedProducts,
        textElements: populatedTextElements,
        collaborators: populatedCollaborators,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        isPublic: board.isPublic,
        settings: board.settings,
    };
    res.status(200).json(new ApiResponse(200, raiBoard, "Board fetched successfully"));
});

const createBoard = asyncHandler(async (req, res) => {
    const { name, description, products, textElements, settings, isPublic } = req.body;
    const userId = req.user._id;

    if (!name) {
        throw new ApiError(400, "Board name is required");
    }

    const newBoard = new Board({
        user_id: userId,
        name,
        description,
        products: products || [],
        textElements: textElements || [],
        collaborators: [{
            id: userId,
            role: 'owner'
        }],
        settings: settings || {
            gridSize: 50,
            showGrid: true,
            allowOverlap: true,
            minZoom: 0.5,
            maxZoom: 3,
        }, // Apply default settings if not provided
        isPublic: isPublic || false,
    });

    const board = await newBoard.save();

    const populatedProducts = await populateBoardProducts(board.products);
    const populatedTextElements = populateBoardTextElements(board.textElements);
    const populatedCollaborators = await populateBoardCollaborators(board.collaborators);

    const raiBoard = {
        id: board._id,
        name: board.name,
        description: board.description,
        products: populatedProducts,
        textElements: populatedTextElements,
        collaborators: populatedCollaborators,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
        isPublic: board.isPublic,
        settings: board.settings,
    };

    res.status(201).json(new ApiResponse(201, raiBoard, "Board created successfully"));
});

const updateBoard = asyncHandler(async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user._id;
    const { name, description, products, textElements, collaborators, settings, updatedAt, isPublic } = req.body;

    const board = await Board.findOne({ _id: boardId, isDeleted: false });
    board.products = convertFrontendProductsToMongo(products);
    board.textElements = convertFrontendTextElementsToMongo(textElements);
    board.name = name;
    board.description = description;
    board.settings = settings;
    board.updatedAt = updatedAt;
    board.isPublic = isPublic;

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    // Ensure user is owner or collaborator for update
    if (board.user_id.toString() !== userId.toString() && !board.collaborators.includes(userId)) {
        throw new ApiError(403, "Unauthorized to update this board");
    }

    const updatedBoard = await board.save();
    const populatedProducts = await populateBoardProducts(updatedBoard.products);
    const populatedTextElements = populateBoardTextElements(updatedBoard.textElements);
    const populatedCollaborators = await populateBoardCollaborators(updatedBoard.collaborators);
    const raiBoard = {
        id: updatedBoard._id,
        name: updatedBoard.name,
        description: updatedBoard.description,
        products: populatedProducts,
        textElements: populatedTextElements,
        collaborators: populatedCollaborators,
        createdAt: updatedBoard.createdAt,
        updatedAt: updatedBoard.updatedAt,
        isPublic: updatedBoard.isPublic,
        settings: updatedBoard.settings,
    };
    res.status(200).json(new ApiResponse(200, raiBoard, "Board updated successfully"));
});

const deleteBoard = asyncHandler(async (req, res) => {
    const boardId = req.params.boardId;
    const userId = req.user._id;

    const board = await Board.findOne({ _id: boardId });

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    // Ensure user is the owner for deletion
    if (board.user_id.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to delete this board");
    }

    await Board.deleteOne({ _id: boardId });

    res.status(200).json(new ApiResponse(200, null, "Board marked as deleted successfully"));
});

const addProductToBoard = asyncHandler(async (req, res) => {
    const { boardId, productId } = req.params;
    const userId = req.user._id;

    const board = await Board.findOne({ _id: boardId, isDeleted: false });

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    // Ensure user is owner or collaborator
    if (board.user_id.toString() !== userId.toString() && !board.collaborators.some(c => c.id.toString() === userId.toString())) {
        throw new ApiError(403, "Unauthorized to add product to this board");
    }

    if (board.products.some(p => p.product_id.toString() === productId)) {
        throw new ApiError(400, "Product already exists in the board");
    }
    board.products.push({
        product_id: productId,
        position: {
            x: 0,
            y: 0,
        },
        size: {
            width: 500,
            height: 500,
        },
        zIndex: 1,
        rotation: 0,
    });
    await board.save();

    res.status(200).json(new ApiResponse(200, null, "Product added to board successfully"));
});

const removeProductFromBoard = asyncHandler(async (req, res) => {
    const { boardId, productId } = req.params;
    const userId = req.user._id;

    const board = await Board.findOne({ _id: boardId, isDeleted: false });

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    // Ensure user is owner or collaborator
    if (board.user_id.toString() !== userId.toString() && !board.collaborators.some(c => c.id.toString() === userId.toString())) {
        throw new ApiError(403, "Unauthorized to remove product from this board");
    }

    const initialProductCount = board.products.length;
    board.products = board.products.filter(p => p.product_id.toString() !== productId);

    if (board.products.length === initialProductCount) {
        throw new ApiError(404, "Product not found in the board");
    }

    await board.save();
    res.status(200).json(new ApiResponse(200, null, "Product removed from board successfully"));
});

const createBoardInvite = asyncHandler(async (req, res) => {
    const { boardId } = req.params; // Assuming boardId is in route params
    const { inviteeEmail, role } = req.body;
    const inviter = req.user._id; // Get inviter's name from authenticated user
    if (!inviteeEmail || !role) {
        throw new ApiError(400, "Invitee email and role are required");
    }
    const user = await User.findOne({ email: inviteeEmail });
    if (!user) {
        throw new ApiError(404, "User with provided email not found");
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Set expiration to 7 days from now
    const newInvite = new Invite({
        boardId, invitedUser: user._id, role, inviter, expiresAt
    });
    await newInvite.save();
    const board = await Board.findById(newInvite.boardId);

    res.status(201).json(new ApiResponse(201, mapRaiBoardInviteToResponse(newInvite, board), "Board invite created successfully"));
});

const getBoardInvites = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const invites = await Invite.find({ invitedUser: userId }).populate("inviter");
    const mappedInvites = await Promise.all(invites.map(async (invite) => {
        const board = await Board.findById(invite.boardId);
        if (!board) {
            return null; // Or handle the case where the board is not found
        }
        return mapRaiBoardInviteToResponse(invite, board);
    }));
    res.status(200).json(new ApiResponse(200, mappedInvites.filter(invite => invite !== null), "Board invites fetched successfully"));
});

const acceptBoardInvite = asyncHandler(async (req, res) => {
    const inviteId = req.params.inviteId;
    const userId = req.user._id;
    const invite = await Invite.findOne({ _id: inviteId, invitedUser: userId });
    if (!invite) {
        throw new ApiError(404, "Board invite not found or already accepted/declined");
    }
    const board = await Board.findById(invite.boardId);
    if (!board) {
        throw new ApiError(404, "Board not found");
    }
    board.collaborators.push({ id: userId, role: invite.role }); // Assuming 'editor' role for accepted invites
    await board.save();
    await Invite.deleteOne({ _id: inviteId });
    res.status(200).json(new ApiResponse(200, { accepted: true }, "Board invite accepted successfully"));
});

const declineBoardInvite = asyncHandler(async (req, res) => {
    const inviteId = req.params.inviteId;
    const userId = req.user._id;
    const invite = await Invite.findOneAndDelete({ _id: inviteId, invitedUser: userId });
    if (!invite) {
        throw new ApiError(404, "Board invite not found or already accepted/declined");
    }
    res.status(200).json(new ApiResponse(200, null, "Board invite declined successfully"));
});


const changeCollaboratorStatus = asyncHandler(async (req, res) => {
    const { userId, newRole } = req.body;
    const { boardId } = req.params;
    const currentUserId = req.user._id;

    if (!boardId || !userId || !newRole) {
        throw new ApiError(400, "Board ID, user ID, and new role are required");
    }

    const board = await Board.findById(boardId);

    if (!board) {
        throw new ApiError(404, "Board not found");
    }

    // Check if the current user is the owner of the board
    if (board.user_id.toString() !== currentUserId.toString()) {
        throw new ApiError(403, "Only the board owner can change collaborator roles");
    }

    const collaboratorToUpdate = board.collaborators.find(c => c.id.toString() === userId);

    if (!collaboratorToUpdate) {
        throw new ApiError(404, "Collaborator not found in this board");
    }

    // Update the role of the collaborator
    collaboratorToUpdate.role = newRole;
    await board.save();

    const populatedCollaborators = await populateBoardCollaborators(board.collaborators);

    res.status(200).json(new ApiResponse(200, populatedCollaborators, "Collaborator role updated successfully"));
});

export {
    getBoards,
    getBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    addProductToBoard,
    removeProductFromBoard,
    createBoardInvite,
    getBoardInvites,
    acceptBoardInvite,
    declineBoardInvite,
    changeCollaboratorStatus,
};
const populateBoardProducts = async (products) => {
    return await Promise.all(products.map(async (product) => {
        const productDetails = await Product.findById(product.product_id);
        const images = await Image.find({ _id: { $in: productDetails.images } }).select('url');
        const imagesUrls = images.length > 0 ? images.map(image => image.url) : "";
        return {
            id: productDetails._id,
            productId: productDetails?._id || null,
            productName: productDetails?.name || 'Unknown Product',
            productImage: productDetails?.imageUrls[0] || imagesUrls[0] || "",
            productPrice: productDetails?.price || 0,
            position: product.position || { x: 0, y: 0 },
            size: product.size || { width: 100, height: 100 },
            zIndex: product.zIndex || 0,
            rotation: product.rotation || 0,
        };
    }));
};

const convertFrontendProductsToMongo = (frontendProducts) => {
    return frontendProducts.map(product => {
        if (!product.productId) {
            // Handle error or return null if productId is missing
            console.error("Missing productId in frontend product data");
            return null;
        }
        return {
            product_id: new mongoose.Types.ObjectId(product.productId),
            position: product.position || {
                x: 0,
                y: 0
            },
            size: product.size || {
                width: 100,
                height: 100
            },
            zIndex: product.zIndex || 0,
            rotation: product.rotation || 0,
        };
    }).filter(product => product !== null); // Filter out any null entries due to missing productId
};

const convertFrontendTextElementsToMongo = (frontendTextElements) => {
    return frontendTextElements.map(textElement => ({
        content: textElement.content,
        type: textElement.type,
        position: textElement.position || {
            x: 0,
            y: 0
        },
        size: textElement.size || {
            width: 100,
            height: 50
        },
        zIndex: textElement.zIndex || 0,
        fontSize: textElement.fontSize || 16,
        color: textElement.color || '#000000',
        fontWeight: textElement.fontWeight || 'normal',
    }));
};


const populateBoardTextElements = (textElements) => {
    return textElements.map(textElement => ({
        id: textElement._id,
        content: textElement.content,
        position: textElement.position || { x: 0, y: 0 },
        size: textElement.size || { width: 100, height: 50 },
        zIndex: textElement.zIndex || 0,
        rotation: textElement.rotation || 0,
        fontSize: textElement.fontSize || 16,
        color: textElement.color || '#000000',
        fontWeight: textElement.fontWeight || 'normal',
        fontStyle: textElement.fontStyle || 'normal',
        textDecoration: textElement.textDecoration || 'none',
    }));
};

const populateBoardCollaborators = async (collaborators) => {
    return await Promise.all(collaborators.map(async (collaborator) => {
        const userDetails = await User.findById(collaborator.id);
        return {
            id: collaborator.id,
            userName: userDetails?.fullname || 'Unknown User',
            userAvatar: userDetails?.avatar || '',
            role: collaborator.role,
            joinedAt: collaborator.joinedAt,
            isOnline: false, // This information is not stored, defaulting to false
        };
    }));
};