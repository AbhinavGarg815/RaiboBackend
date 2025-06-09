import { body, param } from "express-validator";
import { validationHandler } from "../../utils/validationHandler.js";


// Validator for getting image by ID
const getImageByIdValidator = [
    param('id').trim().notEmpty().withMessage('Invalid image ID'),
    validationHandler,
];

const uploadImageValidator = [
    body().custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Image file is required');
        }
        const file = req.file;
        // Accept common image mime types

        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Invalid image file type');
        }
        return true;
    }),
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
