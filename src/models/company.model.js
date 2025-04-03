import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
        trim: true
    }
})

export const Company = mongoose.model("Company", companySchema)