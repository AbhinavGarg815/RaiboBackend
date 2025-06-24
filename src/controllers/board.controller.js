import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import { Board } from '../models/board.model.js';
import { Product } from '../models/product.model.js';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Image } from '../models/images.model.js';

const getBoards = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const boards = await Board.find({
        $or: [
            { user_id: userId },
            { collaborators: userId }
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
            { user_id: userId },
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
    console.log(initialProductCount);
    console.log(board.products.length);
    if (board.products.length === initialProductCount) {
        throw new ApiError(404, "Product not found in the board");
    }

    await board.save();
    res.status(200).json(new ApiResponse(200, null, "Product removed from board successfully"));
});

const createBoardInvite = asyncHandler(async (req, res) => {
    // Placeholder function for creating a board invitation
    res.status(200).json(new ApiResponse(200, null, "createBoardInvite function called"));
});

const acceptBoardInvite = asyncHandler(async (req, res) => {
    // Placeholder function for accepting a board invitation
    res.status(200).json(new ApiResponse(200, null, "acceptBoardInvite function called"));
});

const declineBoardInvite = asyncHandler(async (req, res) => {
    // Placeholder function for declining a board invitation
    res.status(200).json(new ApiResponse(200, null, "declineBoardInvite function called"));
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
    acceptBoardInvite,
    declineBoardInvite
};
const populateBoardProducts = async (products) => {
    return await Promise.all(products.map(async (product) => {
        const productDetails = await Product.findById(product.product_id);
        const images = await Image.find({ _id: { $in: productDetails.images } }).select('url');
        const imagesUrls = images.length > 0 ? images.map(image => image.url) : "";
        console.log(imagesUrls);
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
        type : textElement.type,
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