import express from 'express';
import { upload , multerErrorHandler } from '../middlewares/multer.middleware.js';
import { uploadImage, deleteImage, getImageById} from '../controllers/image.controller.js';
import { getImageByIdValidator, deleteImageByIdValidator, uploadImageValidator} from '../middlewares/validators/image.validator.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = express.Router();

router.post('/upload', jwtAuthenticator,upload.single('image') , multerErrorHandler, uploadImageValidator,uploadImage);
router.get('/:id', getImageByIdValidator, getImageById);
router.get('/delete/:id',deleteImageByIdValidator , deleteImage);


export default router;
