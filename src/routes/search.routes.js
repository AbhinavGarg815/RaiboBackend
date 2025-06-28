import { Router } from 'express';
import { search, textSearch } from '../controllers/search.controller.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';
import { upload , multerErrorHandler } from '../middlewares/multer.middleware.js';

const router = Router();

router.post('/', upload.single('image'), multerErrorHandler, textSearch);
router.post('/text-search', jwtAuthenticator, textSearch);

export default router;