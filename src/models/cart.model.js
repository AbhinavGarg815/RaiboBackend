import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    buyer_id: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },

    status:
    {
        type:String,
        required: true,
        enum: ['open','closed'],
        default: 'open'
    },

    products: [
        {
            product_id: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
})

export const Cart = mongoose.model("Cart", cartSchema);
