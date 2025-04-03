import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
    street: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    zip: {
        type: String, 
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
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
})

export const Address = mongoose.model("Address", addressSchema)