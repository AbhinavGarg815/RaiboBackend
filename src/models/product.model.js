import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
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
})

export const Product = mongoose.model("Product", productSchema)