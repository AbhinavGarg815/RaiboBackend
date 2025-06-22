import { body } from 'express-validator';
import { validationHandler } from '../../utils/validationHandler';

export const kycValidationRules = [
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('documentType').notEmpty().withMessage('Document type is required'),
    body('imageId').notEmpty().withMessage('Image ID is required'),
    validationHandler
];
