import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        }
    ],
})

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);