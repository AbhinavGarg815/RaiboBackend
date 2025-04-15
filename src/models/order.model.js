import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    cart_id: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
        required: true,
    },
    payment_method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'cash_on_delivery'],
        required: true,
    },
    method_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'cardDetails',
    },
    receiver_name: {
        type: String,
        required: true,
        trim: true,
    },
    receiver_phone: {
        type: String,
        required: true,
        trim: true,
    },
    delivery_date: {
        type: Date
    }
},{
    timestamps: true,
})

export const Order = mongoose.model("Order", orderSchema);
