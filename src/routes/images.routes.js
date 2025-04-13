import express from 'express';
import { upload , multerErrorHandler } from '../middlewares/multer.middleware.js';
import { uploadImage, deleteImage, getImageById} from '../controllers/image.controller.js';
import { getImageByIdValidator, deleteImageByIdValidator} from '../middlewares/validators/image.validator.js';

const router = express.Router();

router.post('/upload', upload.single('image') , multerErrorHandler,uploadImage);
router.get('/:id', getImageByIdValidator, getImageById);
router.get('/delete/:id',deleteImageByIdValidator , deleteImage);


export default router;
