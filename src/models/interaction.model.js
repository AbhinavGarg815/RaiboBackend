import mongoose, { mongo, Schema } from "mongoose";

const interactionSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    interactionType: {
        type: String,
        enum: ['view', 'click', 'add_to_cart', 'purchase', 'like', 'share', 'review'],
        required: true
    },
    interactionValue: {
        type: Number,
        default: 1
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const Interaction = mongoose.model("Interaction", interactionSchema)