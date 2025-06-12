import { Company } from "../models/company.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Image } from "../models/images.model.js";

export const submitKYC = asyncHandler(async (req, res) => {
    const { companyId, documentType, imageId } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }

    const duplicate  = company.kyc.find(doc => doc.documentType === documentType && ["pending", "approved"].includes(doc.status));
    if (duplicate) {
        return res.status(400).json({ message: "KYC document of this type already exists" });
    }

    const image = await Image.findById(imageId);
    if (!image) {
        return res.status(404).json({ message: "Image not found" });
    }

    const newKYC = {
        status: "pending",
        documentType,
        documentUrl: image.url,
        submittedAt: new Date(),
    }

    company.kyc.push(newKYC);

    await company.save();
    res.status(201).json({ message: "KYC submitted successfully" , kyc: newKYC});
});

export const reviewKYC = asyncHandler(async (req, res) => {
    const { companyId, kycId, status, rejectionReason } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
        return res.status(404).json({ message: "Company not found" });
    }
    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
    }

    const kycDoc = company.kyc.id(kycId);
    if (!kycDoc) {
        return res.status(404).json({ message: "KYC document not found" });
    }
    kycDoc.status = status;
    kycDoc.rejectionReason = rejectionReason || null;
    kycDoc.reviewedAt = new Date();
    kycDoc.reviewedBy = req.user._id;
    await company.save();
    res.status(200).json({ message: "KYC reviewed successfully", company });
});

export const getPendingKYC = asyncHandler(async (req, res) => {
    const companies = await Company.find({ "kyc.status": "pending" });
    res.status(200).json({ message: "Pending KYC requests retrieved successfully", companies });
});