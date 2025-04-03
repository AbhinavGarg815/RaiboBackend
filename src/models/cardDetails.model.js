import mongoose, { Schema } from "mongoose";

const cardDetailsSchema = new Schema({
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
        type: String,
        required: true,
        trim: true,
    }
})

export const cardDetails = mongoose.model("cardDetails", cardDetailsSchema)