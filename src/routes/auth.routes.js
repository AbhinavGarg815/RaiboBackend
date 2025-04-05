import { loginUser, registerUser, logoutUser, refreshToken,  } from '../controllers/auth.controller.js';
import { Router } from "express";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);

export default router