import { body } from "express-validator";
import { validationHandler } from "../../utils/validationHandler.js";

 const companyCreateValidator= [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim(),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email must be valid")
        .trim()
        .normalizeEmail(),
    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),
        validationHandler
];

const companyUpdateValidator = [
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .trim(),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email must be valid")
        .trim()
        .normalizeEmail(),
    body("address")
        .optional()
        .notEmpty(),
        validationHandler

];

export {companyCreateValidator, companyUpdateValidator}
