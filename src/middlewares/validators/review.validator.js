import { body  } from 'express-validator';
import { validationHandler } from '../../utils/validationHandler.js';

const reviewCreateValidator = [
  body('product_id')
    .isMongoId()
    .withMessage('Cart ID must be a valid MongoDB ObjectId'),
  body('title')
    .isString()
    .optional()
    .withMessage('Title is required'),
  body('content')
    .isString()
    .optional()
    .trim(),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  validationHandler,
];



export {reviewCreateValidator};
