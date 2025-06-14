import {  Router } from 'express';
import { searchByImage, searchByText, searchByTextAndImage } from '../controllers/search.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = Router();

router.post('/image', jwtAuthenticator, searchByImage);
router.post('/text', jwtAuthenticator, searchByText);
router.post('/image-text', jwtAuthenticator, searchByTextAndImage);

export default router;