import express from 'express';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { companyCreateValidator, companyUpdateValidator } from '../middlewares/validators/company.validator.js';
import { createCompany , getAllCompanies, getCompanyById, updateCompany, deleteCompany } from '../controllers/company.controller.js';

const router = express.Router();


router.post('/', jwtAuthenticator,  companyCreateValidator, createCompany);
router.get('/', jwtAuthenticator, getAllCompanies);
router.get('/:id', jwtAuthenticator,getCompanyById);
router.put('/:id', jwtAuthenticator, companyUpdateValidator,updateCompany);
router.delete('/:id', jwtAuthenticator, deleteCompany);

export default router;
