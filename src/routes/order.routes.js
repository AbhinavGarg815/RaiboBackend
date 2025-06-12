import { Router } from 'express';
import { createOrder, getOrderById, getOrdersByUserId } from '../controllers/order.controller.js';
import { orderCreateValidator,  orderGetValidator } from '../middlewares/validators/order.validator.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.post('/', jwtAuthenticator, orderCreateValidator, createOrder);
router.get('/:orderId', jwtAuthenticator, orderGetValidator, getOrderById);
router.get('/', jwtAuthenticator, getOrdersByUserId);

export default router;
