import { body , param } from 'express-validator';
import { validationHandler } from '../../utils/validationHandler.js';

const orderCreateValidator = [
  body('cart_id')
    .isMongoId()
    .withMessage('Cart ID must be a valid MongoDB ObjectId'),
  body('address_id')
    .isMongoId()
    .withMessage('Address must be a valid MongoDB ObjectId'),
  body('payment_method')
    .isString()
    .withMessage('Payment method must be a string')
    .isIn(['credit_card', 'debit_card', 'cash_on_delivery'])
    .withMessage('Payment method must be one of: credit_card, debit_card, cash_on_delivery')
    .notEmpty()
    .withMessage('Payment method is required'),
  body('receiver_name')
    .isString()
    .withMessage('Receiver name must be a string')
    .notEmpty()
    .withMessage('Receiver name is required')
    .trim(),
  body('method_id')
    .isMongoId()
    .withMessage('method ID must be a valid MongoDB ObjectId'),
  body('receiver_phone')
    .isString()
    .withMessage('Receiver phone must be a string')
    .notEmpty()
    .withMessage('Receiver phone is required')
    .trim(),
  body('delivery_date')
    .optional()
    .isISO8601()
    .withMessage('Delivery date must be a valid ISO 8601 date'),
  validationHandler,
];

const orderGetValidator = [
  param('orderId').isMongoId().withMessage('Invalid order ID'),
  validationHandler
];


export {orderCreateValidator, orderGetValidator}
