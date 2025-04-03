import mongoose, { Schema } from "mongoose";

const logisticsSchema = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'shipped', 'delivered', 'returned'],
    }
})

export const Logistics = mongoose.model("Logistics", logisticsSchema);