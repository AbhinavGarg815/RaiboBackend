import mongoose, { Schema } from "mongoose";

const merchantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        {
            type: String,
            enum: ['admin', 'staff'],
            required: true
        }
    ]
})

export const Merchant = mongoose.model("Merchant", merchantSchema)