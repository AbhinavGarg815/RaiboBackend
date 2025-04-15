import { Router } from 'express';
import { createReview, getReviews, deleteReview } from '../controllers/review.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.post('/',jwtAuthenticator, createReview);
router.get('/:product_id', jwtAuthenticator, getReviews);
router.delete('/:id', jwtAuthenticator, deleteReview);

export default router;
