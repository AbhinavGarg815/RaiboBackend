import { Router } from 'express';
import { createReview, getReviews, deleteReview } from '../controllers/review.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createReview);
router.get('/:product_id', authMiddleware, getReviews);
router.delete('/:id', authMiddleware, deleteReview);

export default router;