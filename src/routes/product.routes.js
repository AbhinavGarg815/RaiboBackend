import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductInfoById,getAllProductsBuyer } from '../controllers/product.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { productCreateValidator, productDeleteValidator, productGetByCategoryValidator, productGetByCompanyValidator, productGetByIdValidator, productUpdateValidator } from '../middlewares/validators/product.validator.middleware.js'; 
// import { getProductsByCategory, getProductsByCompany } from '../controllers/product.controller.js';

//Removing JWT auth for now
const router = Router();
router.post('/seller/:company_id', productCreateValidator, createProduct);
router.get('/seller/:company_id', getAllProducts);
router.get('/seller/:company_id/:id', productGetByIdValidator, getProductById);
router.put('/seller/:company_id/:id', productUpdateValidator, updateProduct);
router.delete('/seller/:company_id/:id', productDeleteValidator, deleteProduct);

// Buyer Route
router.get('/:id', productGetByIdValidator, getProductInfoById);
router.get('/', getAllProductsBuyer);

export default router;