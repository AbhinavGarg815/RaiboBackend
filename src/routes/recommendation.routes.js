import express from 'express';
import { getRecommendations } from '../controllers/recommendation.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = express.Router();

router.post('/', jwtAuthenticator, getRecommendations);

export default router;