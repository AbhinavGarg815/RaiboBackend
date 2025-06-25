import mongoose, { Schema } from "mongoose";

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    companyType: { 
        type: String,
        trim: true,
    },
    companyLogoUrl: { 
        type: String,
        trim: true,
    },
    description: { // Added description field
        type: String,
        trim: true,
    },
    address: { 
        type: Schema.Types.ObjectId,
        ref: 'Address',
    },
    contactName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    contactPhone: {
        type: String,
        trim: true,
    },
    kyc: [{ // Reference to the new KYC model
        type: Schema.Types.ObjectId,
        ref: 'KYC',
    }],
    shops: [{
        type: Schema.Types.ObjectId,
        ref: 'Shop' 
    }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    users: { 
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
}, { timestamps: true }); 

export const Company = mongoose.model("Company", companySchema)