import express from 'express';
import { submitKYC, reviewKYC, getPendingKYC } from '../controllers/kyc.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { authorizePermissionMiddleware } from '../middlewares/authorizePermission.middleware.js';

const router = express.Router();

router.post('/submit', jwtAuthenticator, submitKYC);
router.post('/review', jwtAuthenticator, authorizePermissionMiddleware('admin'), reviewKYC);
router.get('/pending', jwtAuthenticator, authorizePermissionMiddleware('admin'), getPendingKYC);

export default router;
