import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsByCompany } from '../controllers/product.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.post('/', jwtAuthenticator, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', jwtAuthenticator, updateProduct);
router.delete('/:id', jwtAuthenticator, deleteProduct);
router.get('/category/:category_id', getProductsByCategory);
router.get('/company/:company_id', getProductsByCompany);

export default router;
