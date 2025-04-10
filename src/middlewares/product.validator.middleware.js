import {body, param} from "express-validator";
import {validationHandler} from "../utils/validationHandler.js";

const productCreateValidator = [
    body('name')
        .isString()
        .notEmpty()
        .trim(),
    body('description')
        .isString()
        .notEmpty()
        .trim(),
    body('price')
        .isNumeric()
        .notEmpty()
        .isFloat({ min: 0 }),
    body('quantity')
        .isNumeric()
        .notEmpty()
        .isFloat({ min: 0 }),
    body('category_id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid category ID'),
    body('company_id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid company ID'),
    body('images')
        .isArray({ min: 1 })
        .withMessage('At least one image is required')
        .custom((value, { req }) => {
            const imageIds = value.map(image => image._id);
            req.body.images = imageIds;
            return true;
        }),
        body("discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount must be greater than or equal to 0"),
    body("discount_valid_until")
        .optional()
        .isDate()
        .isAfter(new Date().toISOString())
        .withMessage("Discount valid until date must be a valid date and in the future"),
    validationHandler
];

const productUpdateValidator = [
    param('id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid product ID'),
    body('name')
        .optional()
        .isString()
        .notEmpty()
        .trim(),
    body('description')
        .optional()
        .isString()
        .notEmpty()
        .trim(),
    body('price')
        .optional()
        .isNumeric()
        .notEmpty()
        .isFloat({ min: 0 }),
    body('quantity')
        .optional()
        .isNumeric()
        .notEmpty()
        .isFloat({ min: 0 }),
    body('category_id')
        .optional()
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid category ID'),
    body('company_id')
        .optional()
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid company ID'),
    body('images')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one image is required')
        .custom((value, { req }) => {
            const imageIds = value.map(image => image._id);
            req.body.images = imageIds;
            return true;
        }),
    body("discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount must be greater than or equal to 0"),
    body("discount_valid_until")
        .optional()
        .isDate()
        .isAfter(new Date().toISOString())
        .withMessage("Discount valid until date must be a valid date and in the future"),
    validationHandler
];

const productDeleteValidator = [
    param('id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid product ID'),
    validationHandler
];

const productGetValidator = [
    param('id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid product ID'),
    validationHandler
];

const productGetByIdValidator = [
    param('id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid product ID'),
    validationHandler
];

const productGetByCategoryValidator = [
    param('category_id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid category ID'),
    validationHandler
];
const productGetByCompanyValidator = [
    param('company_id')
        .isMongoId()
        .notEmpty()
        .withMessage('Invalid company ID'),
    validationHandler
];

export { productCreateValidator, productDeleteValidator, productUpdateValidator, productGetValidator, productGetByIdValidator, productGetByCategoryValidator, productGetByCompanyValidator };
