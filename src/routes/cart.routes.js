import { Router } from "express";
import {
   getCartByBuyerId,
    addProductToCart,
    removeProductFromCart,
    deleteCart,
    updateProductQuantityInCart,
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
router.put("/update-quantity", jwtAuthenticator, updateProductQuantityInCart);
export default router;
