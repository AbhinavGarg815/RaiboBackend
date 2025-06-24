import mongoose, { Schema } from "mongoose";

const kycDocumentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    fileURL: {
        type: String,
        required: true,
        trim: true,
    },
    documentType: { // e.g., 'Business License', 'Tax ID', 'Passport'
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false }); // Do not create a separate _id for subdocuments

const kycCommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    adminUser: { // User who made the comment
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { _id: false });

const kycSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    // Removed documentType and documentUrl as they are now part of kycDocuments array
    rejectionReason: {
        type: String,
        default: null,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    reviewedAt: Date,
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    documents: [kycDocumentSchema], // Array of documents for this KYC application
    comments: [kycCommentSchema], // Array of comments for this KYC application
}, { timestamps: true });

export const KYC = mongoose.model("KYC", kycSchema);