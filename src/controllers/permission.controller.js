import { Permission } from '../models/permission.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';  

const createPermission = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const exists = await Permission.findOne({ name });
        if (exists) {
            return res.status(400).json({
                message: 'Permission already exists',
            });
        }
        const permission = await Permission.create({ name });
        res.status(201).json({
            message: 'Permission created successfully',
            permission,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const getAllPermissions = asyncHandler(async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).json({
            message: 'Permissions fetched successfully',
            permissions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const getPermissionById = asyncHandler(async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
            return res.status(400).json({
                message: 'Permission not found',
            });
        }
        res.status(200).json({
            message: 'Permission fetched successfully',
            permission,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const updatePermission = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const permission = await Permission.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
        if (!permission) {
            return res.status(400).json({
                message: 'Permission not found',
            });
        }
        res.status(200).json({
            message: 'Permission updated successfully',
            permission,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

const deletePermission = asyncHandler(async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) {
            return res.status(400).json({
                message: 'Permission not found',
            });
        }
        res.status(200).json({
            message: 'Permission deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

export { createPermission, getAllPermissions, getPermissionById, updatePermission, deletePermission };