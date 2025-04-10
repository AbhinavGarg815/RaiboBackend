import { body, param } from "express-validator";
import { validationHandler } from "../utils/validationHandler.js";



const methodCreateValidator = [
    body("card_number").trim().notEmpty().withMessage("card_number is required"),
    body("card_holder").trim().notEmpty().withMessage("card_holder is required"),
    body("expiry_date").trim().notEmpty().isDate().isAfter(new Date().toISOString()).withMessage("expiry_date should be valid"),
    validationHandler,
];

const methodUpdateValidator = [
    param("id").trim().notEmpty().withMessage("method id is required"),
    body("card_number").trim().notEmpty().withMessage("card_number is required"),
    body("card_holder").trim().notEmpty().withMessage("card_holder is required"),
    body("expiry_date").trim().notEmpty().isDate().isAfter(new Date().toISOString()).withMessage("expiry_date should be valid"),
    validationHandler,
];

const methodDeleteValidator = [
    param("id").trim().notEmpty().withMessage("method id is required"),
    validationHandler
];

const methodGetValidator = [
    param("id").trim().notEmpty().withMessage("user_id is required"),
    validationHandler
];


export {methodCreateValidator, methodUpdateValidator, methodDeleteValidator, methodGetValidator}
