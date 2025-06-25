import { Company }from '../models/company.model.js';
import { asyncHandler} from '../utils/asyncHandler.js';


export const createCompany = asyncHandler(async (req, res) => {
    try {
        const { name, email } = req.body;
        const company = new Company({ name, email });
        await company.save();
        res.status(201).json({ message: 'Company created successfully', company });
    } catch (error) {
        res.status(500).json({ message: 'Error creating company', error: error.message });
    }
});

export const getAllCompanies = asyncHandler(async (req, res) => {
    try {
        const companies = await Company.find().populate('shops').populate('address').populate('users').populate('kycDocuments');
        res.status(200).json(new ApiResponse(200, companies, 'Companies fetched successfully'));
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json(new ApiResponse(500, null, 'Error fetching companies', false));
    }
});

export const getCompanyById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id).populate('shops').populate('address').populate('users').populate('kycDocuments');
        if (!company) {
            throw new ApiError(404, 'Company not found');
        }
        res.status(200).json(new ApiResponse(200, company, 'Company fetched successfully'));
    } catch (error) {
        console.error("Error fetching company:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message, false));
        } else {
            res.status(500).json(new ApiResponse(500, null, 'Error fetching company', false));
        }
    }
});

// Single API to update company details
export const updateCompanyDetails = asyncHandler(async (req, res) => {
    try {
        const companyId = req.user?.company; // Extract companyId from authenticated user
        if (!companyId) {
            throw new ApiError(403, "User is not associated with a company or company ID missing from token");
        }

        const updates = { ...req.body }; // Get all updates from the request body

        // Handle address update separately if provided
        if (updates.address) {
            if (typeof updates.address === 'string') { // If an existing address ID is passed
                const existingAddress = await Address.findById(updates.address);
                if (!existingAddress) {
                    throw new ApiError(404, "Provided address ID for update not found");
                }
                // If it's an ID, just assign it
                updates.address = updates.address;
            } else if (typeof updates.address === 'object') { // If a new address object is passed
                // Find existing address for the company
                const company = await Company.findById(companyId);
                if (company && company.address) {
                    // Update the existing address
                    await Address.findByIdAndUpdate(company.address, updates.address, { new: true, runValidators: true });
                    updates.address = company.address; // Keep the existing address ID
                } else {
                    // Create a new address if none exists or if company.address is null
                    const newAddress = new Address(updates.address);
                    await newAddress.save();
                    updates.address = newAddress._id;
                }
            }
        }


        const company = await Company.findByIdAndUpdate(companyId, updates, { new: true, runValidators: true })
                                    .populate('shops')
                                    .populate('address')
                                    .populate('users')
                                    .populate('kycDocuments');

        if (!company) {
            throw new ApiError(404, 'Company not found');
        }
        res.status(200).json(new ApiResponse(200, company, 'Company details updated successfully'));
    } catch (error) {
        console.error("Error updating company details:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message, false));
        } else {
            res.status(500).json(new ApiResponse(500, null, 'Error updating company details', false));
        }
    }
});

// Deprecated: Keeping original updateCompany for reference, but it will be replaced by updateCompanyDetails
export const updateCompany = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const company = await Company.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('shops');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company updated successfully', company });
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error: error.message });
    }
});


export const deleteCompany = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        // Optionally, delete associated shops and KYC documents first
        await Shop.deleteMany({ company: id });
        await KYC.deleteMany({ company: id }); // Delete all KYC documents belonging to this company

        const company = await Company.findByIdAndDelete(id);
        if (!company) {
            throw new ApiError(404, 'Company not found');
        }
        res.status(200).json(new ApiResponse(200, null, 'Company deleted successfully'));
    } catch (error) {
        console.error("Error deleting company:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message, false));
        } else {
            res.status(500).json(new ApiResponse(500, null, 'Error deleting company', false));
        }
    }
});

// New API to add a user to a company
export const addUserToCompany = asyncHandler(async (req, res) => {
    try {
        const companyId = req.user?.company; // Extract companyId from authenticated user
        if (!companyId) {
            throw new ApiError(403, "User is not associated with a company");
        }

        const { userId } = req.body;

        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

        const company = await Company.findById(companyId);
        if (!company) {
            throw new ApiError(404, 'Company not found');
        }

        // Check if user is already in the company
        if (company.users.includes(userId)) {
            throw new ApiError(409, 'User is already part of this company');
        }

        company.users.push(userId);
        await company.save();

        res.status(200).json(new ApiResponse(200, company, 'User added to company successfully'));
    } catch (error) {
        console.error("Error adding user to company:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message, false));
        } else {
            res.status(500).json(new ApiResponse(500, null, 'Error adding user to company', false));
        }
    }
});

// New API to remove a user from a company
export const removeUserFromCompany = asyncHandler(async (req, res) => {
    try {
        const companyId = req.user?.company; // Extract companyId from authenticated user
        if (!companyId) {
            throw new ApiError(403, "User is not associated with a company");
        }

        const { userId } = req.body;

        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

        const company = await Company.findById(companyId);
        if (!company) {
            throw new ApiError(404, 'Company not found');
        }

        // Check if user is in the company
        if (!company.users.includes(userId)) {
            throw new ApiError(404, 'User not found in this company');
        }

        company.users = company.users.filter(user => user.toString() !== userId);
        await company.save();

        res.status(200).json(new ApiResponse(200, company, 'User removed from company successfully'));
    } catch (error) {
        console.error("Error removing user from company:", error);
        if (error instanceof ApiError) {
            res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message, false));
        } else {
            res.status(500).json(new ApiResponse(500, null, 'Error removing user from company', false));
        }
    }
});
