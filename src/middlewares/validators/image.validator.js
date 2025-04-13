import { body, param } from "express-validator";


// Validator for getting image by ID
const getImageByIdValidator = [
    param('id').trim().notEmpty().withMessage('Invalid image ID'),
];

// Validator for deleting image by ID
const deleteImageByIdValidator = [
    param('id').trim().notEmpty().withMessage('Invalid image ID'),
];

export {
    getImageByIdValidator,
    deleteImageByIdValidator,
};
