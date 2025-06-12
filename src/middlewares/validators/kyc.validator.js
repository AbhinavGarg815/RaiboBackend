import { body, validationResult } from 'express-validator';

export const kycValidationRules = [
    body('companyId').notEmpty().withMessage('Company ID is required'),
    body('documentType').notEmpty().withMessage('Document type is required'),
    body('imageId').notEmpty().withMessage('Image ID is required'),
];

export const validate =  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    res.status(400).json({ errors: errors.array() });
};