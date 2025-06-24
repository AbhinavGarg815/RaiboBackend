import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        enum: ['pending','confirmed', 'completed', 'cancelled'],
        default: 'pending',
        required: true,
    },
    totalAmount: {
        type: Number,
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
    },
    orderItems: [
        {
            product_id: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                enum: ['Pending','Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                default: 'Pending',
            },
        },
    ]
},{
    timestamps: true,
})

export const Order = mongoose.model("Order", orderSchema);