import { Router } from 'express';
import { search } from '../controllers/search.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { upload , multerErrorHandler } from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/', jwtAuthenticator, upload.single('image'), multerErrorHandler, search);

export default router;