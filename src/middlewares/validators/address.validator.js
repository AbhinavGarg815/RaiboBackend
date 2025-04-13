import { body, param } from 'express-validator';
import { validationResult } from 'express-validator';
import { validationHandler } from '../../utils/validationHandler.js';

// Validator for creating a new address
 const createAddressValidator = [
    body('street').notEmpty().withMessage('Street is required').trim(),
    body('city').notEmpty().withMessage('City is required').trim(),
    body('state').notEmpty().withMessage('State is required').trim(),
    body('zip').notEmpty().withMessage('ZIP code is required').trim(),
    body('country').notEmpty().withMessage('Country is required').trim(),
    body('receiver_name').notEmpty().withMessage('Receiver name is required').trim(),
    body('receiver_phone').notEmpty().withMessage('Receiver phone is required').trim(),
    validationHandler
];

// Validator for updating an address
const updateAddressValidator = [
    param('id').isMongoId().withMessage('Invalid address ID'),
    body('street').optional().notEmpty().withMessage('Street is required').trim(),
    body('city').optional().notEmpty().withMessage('City is required').trim(),
    body('state').optional().notEmpty().withMessage('State is required').trim(),
    body('zip').optional().notEmpty().withMessage('ZIP code is required').trim(),
    body('country').optional().notEmpty().withMessage('Country is required').trim(),
    body('receiver_name').optional().notEmpty().withMessage('Receiver name is required').trim(),
    body('receiver_phone').optional().notEmpty().withMessage('Receiver phone is required').trim(),
    validationHandler,
];

// Validator for getting an address by ID
 const getAddressByIdValidator = [
    param('id').isMongoId().withMessage('Invalid address ID'),
    validationHandler
];

// Validator for deleting an address by ID
 const deleteAddressByIdValidator = [
    param('id').isMongoId().withMessage('Invalid address ID'),
    validationHandler
];

export {createAddressValidator, getAddressByIdValidator, deleteAddressByIdValidator, updateAddressValidator}
