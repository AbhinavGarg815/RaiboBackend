import { Permission } from '../models/permission.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';  

const createPermission = asyncHandler(async (req, res) => {
    const { key } = req.body;
    const exists = await Permission.findOne({ key });
    if (exists) {
        return res.status(400).json({
            message: 'Permission already exists',
        });
    }
    const permission = await Permission.create({ key });
    res.status(201).json({
        message: 'Permission created successfully',
        permission,
    });
})

const getAllPermissions = asyncHandler(async (req, res) => {
    const permissions = await Permission.find();
    res.status(200).json({
        message: 'Permissions fetched successfully',
        permissions,
    });
})

const getPermissionById = asyncHandler(async (req, res) => {
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
})

const updatePermission = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { key } = req.body;
    const permission = await Permission.findByIdAndUpdate(id, { key }, { new: true });
    if (!permission) {
        return res.status(400).json({
            message: 'Permission not found',
        });
    }
    res.status(200).json({
        message: 'Permission updated successfully',
        permission,
    });
})

const deletePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) {
        return res.status(400).json({
            message: 'Permission not found',
        });
    }
    res.status(200).json({
        message: 'Permission deleted successfully',
    });
})

export { createPermission, getAllPermissions, getPermissionById, updatePermission, deletePermission };