import { Address } from '../models/address.model.js';

// Controller to create a new address
 const createAddress = async (req, res) => {
    try {
        const { street, city, state, zip, country, receiver_name, receiver_phone } = req.body;
        const address = new Address({ street, city, state, zip, country, receiver_name, receiver_phone });
        await address.save();
        res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
        res.status(500).json({ message: 'Error creating address', error: error.message });
    }
};

// Controller to get an address by ID
 const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findById(id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};

// Controller to get all addresses
 const getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

// Controller to update an address by ID
 const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedAddress = await Address.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

// Controller to delete an address by ID
 const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findByIdAndDelete(id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};

export {createAddress, getAddressById, deleteAddress, getAllAddresses, updateAddress}
