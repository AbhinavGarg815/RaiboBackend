import { loginUserGoogleCallback } from '../controllers/google.auth.controller.js';
import { loginUser, registerUser, logoutUser, refreshToken, verifyEmail } from '../controllers/auth.controller.js';
import { Router } from "express";
import { googleAuthenticator, googleCallbackAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);

router.get('/login/google' , googleAuthenticator);
router.get('/callback/google', googleCallbackAuthenticator ,loginUserGoogleCallback);
router.post('/login/google-auth', googleCallbackAuthenticator ,loginUserGoogleCallback);

router.get('/verify-email/:token', verifyEmail);

export default router
