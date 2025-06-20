import { Router } from 'express';
import { 
 createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductInfoById, getAllProductsBuyer, handleLike, 
    getPendingProducts, approveProduct, rejectProduct 
} from '../controllers/product.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { productCreateValidator, productDeleteValidator, productGetByCategoryValidator, productGetByCompanyValidator, productGetByIdValidator, productUpdateValidator } from '../middlewares/validators/product.validator.middleware.js'; 
// import { getProductsByCategory, getProductsByCompany } from '../controllers/product.controller.js';

const router = Router();
router.post('/seller/', jwtAuthenticator, productCreateValidator, createProduct);
router.get('/seller/',jwtAuthenticator, getAllProducts);
router.get('/seller/:id',jwtAuthenticator, productGetByIdValidator, getProductById);
router.put('/seller/:id',jwtAuthenticator, productUpdateValidator, updateProduct);
router.delete('/seller/:id',jwtAuthenticator, productDeleteValidator, deleteProduct);

// Admin routes for product verification
router.get("/admin/pending", jwtAuthenticator, getPendingProducts);
router.put("/admin/approve/:productId", jwtAuthenticator, approveProduct);
router.put("/admin/reject/:productId", jwtAuthenticator, rejectProduct);

// Buyer Route
router.get('/:id',jwtAuthenticator, productGetByIdValidator, getProductById);
router.get('/',jwtAuthenticator, getAllProductsBuyer);
router.get('/for-you', getAllProductsBuyer)
//Like Route
router.post('/like',jwtAuthenticator, handleLike);

export default router;