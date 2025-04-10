import { Router } from 'express';
import {jwtAuthenticator} from '../middlewares/passport.middleware.js';
import { methodCreateValidator, methodDeleteValidator, methodGetValidator, methodUpdateValidator } from '../middlewares/paymentMethods.validator.middleware.js';
import { createPaymentMethod, getAllPaymentMethods, getPaymentMethodById, deletePaymentMethod, updatePaymentMethod } from '../controllers/paymentMethods.controller.js';

const router = Router();

router.post('/',jwtAuthenticator, methodCreateValidator,createPaymentMethod);
router.get('/', jwtAuthenticator, getAllPaymentMethods);
router.post('/update/:id',jwtAuthenticator,methodUpdateValidator ,updatePaymentMethod);
router.delete('/:id', jwtAuthenticator, methodDeleteValidator,deletePaymentMethod);
router.get('/:id', jwtAuthenticator, methodGetValidator,getPaymentMethodById);

export default router;
