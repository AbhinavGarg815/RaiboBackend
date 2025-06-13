import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js"; // Assuming you have a User model
import { ApiError } from "../utils/ApiError.js";

const createComment = asyncHandler(async (req, res) => {
    const { content, reference, onModel, type, parentComment } = req.body;
    const author = req.user._id; // Assuming user is authenticated and user ID is available in req.user

    if (!content || !reference || !onModel || !type) {
        throw new ApiError(400, "Content, reference, onModel, and type are required");
    }

    if (!['internal', 'external'].includes(type)) {
        throw new ApiError(400, "Invalid comment type");
    }

    const comment = await Comment.create({
        content,
        author,
        reference,
        onModel,
        type,
        parentComment: parentComment || null,
    });

    res.status(201).json({
        message: "Comment created successfully",
        comment,
    });
});

const getCommentsByReference = asyncHandler(async (req, res) => {
    const { referenceId } = req.params;

    const comments = await Comment.find({ reference: referenceId, type: 'external', isDeleted: false })
        .populate('author', 'username avatar') // Populate author details, adjust fields as needed
        .populate('parentComment'); // Populate parent comment for replies

    res.status(200).json({
        message: "Comments fetched successfully",
        comments,
    });
});

const replyToComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const author = req.user._id; // Assuming user is authenticated

    if (!content) {
        throw new ApiError(400, "Content is required for a reply");
    }

    const parentComment = await Comment.findById(commentId);

    if (!parentComment || parentComment.isDeleted) {
        throw new ApiError(404, "Parent comment not found");
    }

    const reply = await Comment.create({
        content,
        author,
        reference: parentComment.reference, // Reference the same product/entity as the parent
        onModel: parentComment.onModel, // Use the same model as the parent
        type: parentComment.type, // Inherit type from parent
        parentComment: commentId,
    });

    res.status(201).json({
        message: "Reply created successfully",
        reply,
    });
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Optional: Add authorization check here to ensure only the author or an admin can delete

    comment.isDeleted = true;
    await comment.save();

    res.status(200).json({
        message: "Comment soft deleted successfully",
    });
});

const getInternalCommentsByReference = asyncHandler(async (req, res) => {
    // IMPORTANT: Implement role-based access control here to ensure only admins can access internal comments
    const user = req.user; // Assuming user object is available in req.user

    if (!user || user.role !== 'admin') { // Assuming a 'role' field in your User model
         throw new ApiError(403, "Unauthorized: Only admins can view internal comments");
    }

    const { referenceId } = req.params;

    const comments = await Comment.find({ reference: referenceId, type: 'internal', isDeleted: false })
        .populate('author', 'username avatar') // Populate author details
        .populate('parentComment'); // Populate parent comment for replies

    res.status(200).json({
        message: "Internal comments fetched successfully",
        comments,
    });
});


export {
    createComment,
    getCommentsByReference,
    replyToComment,
    deleteComment,
    getInternalCommentsByReference
};