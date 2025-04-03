import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    buyer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
})

export const Review = mongoose.model("Review", reviewSchema)