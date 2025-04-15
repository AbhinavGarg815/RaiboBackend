import express from 'express';
import { createAddress, getAddressById, deleteAddress, updateAddress, getAllAddresses } from '../controllers/address.controller.js';
import { createAddressValidator, getAddressByIdValidator, deleteAddressByIdValidator , updateAddressValidator} from '../middlewares/validators/address.validator.js';
import { jwtAuthenticator } from '../middlewares/passport.middleware.js';

const router = express.Router();

// Route to create a new address
router.post('/', jwtAuthenticator, createAddressValidator, createAddress);
router.put('/:id', jwtAuthenticator, updateAddressValidator, updateAddress);

// Route to get an address by ID
router.get('/:id', jwtAuthenticator, getAddressByIdValidator, getAddressById);
router.get('/', jwtAuthenticator, getAllAddresses);

// Route to delete an address by ID
router.delete('/:id', jwtAuthenticator, deleteAddressByIdValidator, deleteAddress);

export default router;
