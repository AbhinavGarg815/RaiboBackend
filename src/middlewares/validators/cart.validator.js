import { body } from "express-validator";
import { validationHandler } from "../../utils/validationHandler.js";


const cartAddProductValidator = [
    body("product_id").isMongoId().notEmpty().withMessage("Invalid product ID"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validationHandler,
];

const cartRemoveProductValidator = [
    body("product_id").isMongoId().notEmpty().withMessage("Invalid product ID"),
    validationHandler,
];

export {
    cartAddProductValidator,
    cartRemoveProductValidator,
};
