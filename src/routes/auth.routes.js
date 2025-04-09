import { loginUser, registerUser } from '../controllers/auth.controller.js';
import { loginUserGoogleCallback } from '../controllers/google.auth.controller.js';
import { Router } from "express";
import { googleAuthenticator, googleCallbackAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/login/google' , googleAuthenticator);
router.get('/callback/google', googleCallbackAuthenticator ,loginUserGoogleCallback);

export default router
