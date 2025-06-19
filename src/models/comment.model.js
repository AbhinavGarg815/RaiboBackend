import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reference: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // We will set the 'ref' in the query based on the 'onModel' field
    },
    onModel: {
        type: String,
        required: true,
        enum: ['Product', 'Comment', 'Company', 'KYC'], // Add other models as needed
    },
    type: {
        type: String,
        required: true,
        enum: ['internal', 'external'],
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export { Comment };