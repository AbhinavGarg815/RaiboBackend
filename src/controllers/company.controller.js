import { Company }from '../models/company.model.js';
import { asyncHandler} from '../utils/asyncHandler.js';


export const createCompany = asyncHandler(async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const company = new Company({ name, email, address });
        await company.save();
        res.status(201).json({ message: 'Company created successfully', company });
    } catch (error) {
        res.status(500).json({ message: 'Error creating company', error: error.message });
    }
});

export const getAllCompanies = asyncHandler(async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error: error.message });
    }
});

export const getCompanyById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error: error.message });
    }
});

export const updateCompany = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const company = await Company.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
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
        const company = await Company.findByIdAndDelete(id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error: error.message });
    }
});
