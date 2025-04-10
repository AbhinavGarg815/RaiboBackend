import mongoose, { Schema } from "mongoose";

const cardDetailsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    card_number: {
        type: String,
        required: true,
        trim: true,
    },
    card_holder: {
        type: String,
        required: true,
        trim: true,
    },
    expiry_date: {
        type: Schema.Types.Date,
        required: true,
        trim: true,
    }
})

export const cardDetails = mongoose.model("cardDetails", cardDetailsSchema)
