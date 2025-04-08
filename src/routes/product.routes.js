import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsByCompany } from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.get('/category/:category_id', getProductsByCategory);
router.get('/company/:company_id', getProductsByCompany);

export default router;