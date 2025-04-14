import { body, param } from "express-validator";
import { validationHandler } from "../../utils/validationHandler.js";


// Validator for getting image by ID
const getImageByIdValidator = [
    param('id').trim().notEmpty().withMessage('Invalid image ID'),
    validationHandler,
];

const uploadImageValidator = [
    body('type').trim().notEmpty().withMessage('Invalid image type'),
    validationHandler
];

// Validator for deleting image by ID
const deleteImageByIdValidator = [
    param('id').trim().notEmpty().withMessage('Invalid image ID'),
    validationHandler
];

export {
    getImageByIdValidator,
    deleteImageByIdValidator,
    uploadImageValidator
};
