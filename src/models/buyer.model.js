import mongoose, { Schema } from "mongoose";

const buyerSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addresses: {
        type: [Schema.Types.ObjectId],
        ref: 'Address',
        required: true
    },
    wishlists: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Wishlist',
        }
    ],
    text_search_history: [
        {
            type: String,
            trim: true
        }
    ],
    image_search_history: [
        {
            type: String
        }
    ]
})

export const Buyer = mongoose.model("Buyer", buyerSchema)