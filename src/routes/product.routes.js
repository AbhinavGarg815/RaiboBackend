import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductInfoById,getAllProductsBuyer, handleLike } from '../controllers/product.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { productCreateValidator, productDeleteValidator, productGetByCategoryValidator, productGetByCompanyValidator, productGetByIdValidator, productUpdateValidator } from '../middlewares/validators/product.validator.middleware.js'; 
// import { getProductsByCategory, getProductsByCompany } from '../controllers/product.controller.js';

//Removing JWT auth for now
const router = Router();
router.post('/seller/:company_id', jwtAuthenticator, productCreateValidator, createProduct);
router.get('/seller/:company_id',jwtAuthenticator, getAllProducts);
router.get('/seller/:company_id/:id',jwtAuthenticator, productGetByIdValidator, getProductById);
router.put('/seller/:company_id/:id',jwtAuthenticator, productUpdateValidator, updateProduct);
router.delete('/seller/:company_id/:id',jwtAuthenticator, productDeleteValidator, deleteProduct);

// Buyer Route
router.get('/:id',jwtAuthenticator, productGetByIdValidator, getProductById);
router.get('/',jwtAuthenticator, getAllProductsBuyer);
//Like Route
router.post('/like',jwtAuthenticator, handleLike);

export default router;