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
        //TODO: FIX THIS
        {user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role:
        {
            type: String,
            enum: ['admin', 'staff'],
            required: true
        }}
    ]
})

export const Merchant = mongoose.model("Merchant", merchantSchema)
