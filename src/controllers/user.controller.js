import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);    
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updates = req.body;
        const updatableFields = ['fullname', 'password', 'phone'];
        updatableFields.forEach(field => {
            if (updates[field] !== undefined) {
                user[field] = updates[field];
            }
        });
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

export { getAllUsers, updateUser };