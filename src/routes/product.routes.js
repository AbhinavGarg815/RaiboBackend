import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsByCompany } from '../controllers/product.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { productCreateValidator, productDeleteValidator, productGetByCategoryValidator, productGetByCompanyValidator, productGetByIdValidator, productGetValidator, productUpdateValidator } from '../middlewares/product.validator.middleware.js';

const router = Router();

router.post('/', jwtAuthenticator, productCreateValidator, createProduct);
router.get('/', productGetValidator,getAllProducts);
router.get('/:id', productGetByIdValidator,getProductById);
router.put('/:id', jwtAuthenticator,productUpdateValidator, updateProduct);
router.delete('/:id', jwtAuthenticator, productDeleteValidator,deleteProduct);
router.get('/category/:category_id', productGetByCategoryValidator,getProductsByCategory);
router.get('/company/:company_id', productGetByCompanyValidator,getProductsByCompany);

export default router;
