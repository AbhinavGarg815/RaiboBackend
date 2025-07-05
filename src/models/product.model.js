import mongoose, { Schema } from "mongoose";
import { generateAlphanumericId } from "../utils/idGenerator.js";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    externalProductId: {
        type: String,
        required: false,
        unique: true,
        default: () => generateAlphanumericId(10)
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    threeDModel: {
        type: String,
        required: false,
    },
    features: {
        type: Map,
        of: String
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    company_id: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    images: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Image',
            required: true
        }
    ],
    imageUrls: [
        {
            type: String,
            required: true
        }
    ],
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    discount_valid_until: {
        type: Date,
        default: null
    },
    average_rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    total_ratings: {
        type: Number,
        default: 0,
        min: 0
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    similarProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
})

export const Product = mongoose.model("Product", productSchema)