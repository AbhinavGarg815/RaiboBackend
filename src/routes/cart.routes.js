import { Router } from "express";
import {
   getCartByBuyerId,
    addProductToCart,
    removeProductFromCart,
    deleteCart,
} from "../controllers/cart.controller.js";
import {
    cartAddProductValidator,
    cartRemoveProductValidator,
} from "../middlewares/validators/cart.validator.js";
import {jwtAuthenticator} from "../middlewares/passport.middleware.js";


const router = Router();

router.get("/", jwtAuthenticator, getCartByBuyerId);
router.put("/add", jwtAuthenticator,cartAddProductValidator, addProductToCart);
router.put("/remove", jwtAuthenticator,cartRemoveProductValidator, removeProductFromCart);
router.delete("/", jwtAuthenticator, deleteCart);

export default router;
