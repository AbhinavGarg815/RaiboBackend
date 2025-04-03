import { Router } from "express";
import { signUp, login } from "../../controllers/usersManager.js";
import { signUpValidator, loginValidator } from "../../config/validator.js";

const router = Router();

router.post("/signUp", signUpValidator, signUp);
router.post("/login", loginValidator, login);

export default router;
