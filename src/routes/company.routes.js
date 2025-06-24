import express from 'express';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { companyCreateValidator, companyUpdateValidator } from '../middlewares/validators/company.validator.js';
import { createCompany , getAllCompanies, getCompanyById, updateCompanyDetails, deleteCompany, addUserToCompany, removeUserFromCompany } from '../controllers/company.controller.js';

const router = express.Router();


router.post('/', jwtAuthenticator, companyCreateValidator, createCompany);
router.get('/', jwtAuthenticator, getAllCompanies);
router.get('/:id', jwtAuthenticator, getCompanyById);
router.put('/details', jwtAuthenticator, companyUpdateValidator, updateCompanyDetails); // New route for company details update
router.delete('/:id', jwtAuthenticator, deleteCompany);

// User management routes
router.post('/users', jwtAuthenticator, addUserToCompany);
router.delete('/users', jwtAuthenticator, removeUserFromCompany);

export default router;
