import mongoose, { Schema } from "mongoose";

const kycSchema = new Schema({
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    documentType: { 
        type: String, 
        required: true 
    },
    documentUrl: { 
        type: String, 
        required: true 
    },
    rejectionReason: { 
        type: String, 
        default: null 
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    },
    reviewedAt: Date,
    reviewedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    }
}, { _id: true });

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
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    kyc: [kycSchema],
}, { _id: true })

export const Company = mongoose.model("Company", companySchema)