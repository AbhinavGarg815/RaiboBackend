import { Router } from 'express';
import { initiatePayment } from '../controllers/payment.controller.js';
import {jwtAuthenticator} from "../middlewares/passport.middleware.js";

const router = Router();

router.post('/:orderId',jwtAuthenticator, initiatePayment);

export default router;