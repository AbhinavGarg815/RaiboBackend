import { Role } from "../models/role.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Permission } from "../models/permission.model.js";

const createRole = asyncHandler(async (req, res) => {
    try {
        const { name, permissions } = req.body;
        if (!name || !permissions || permissions.length === 0) {
            return res.status(400).json({
                message: "Name and permissions are required",
            });
        }
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({
                message: "Role already exists",
            });
        }
        const validPermissions = await Permission.find({ _id: { $in: permissions } });
        if (validPermissions.length !== permissions.length) {
            return res.status(400).json({
                message: "Some permissions are invalid",
            });
        }
        const uniquePermissions = [...new Set(validPermissions.map(p => p._id))];
        const role = await Role.create({ name, permissions: uniquePermissions });
        res.status(201).json({
            message: "Role created successfully",
            role,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

const getAllRoles = asyncHandler(async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.status(200).json({
            message: "Roles fetched successfully",
            roles,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

const getRoleById = asyncHandler(async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions');
        if (!role) {
            return res.status(400).json({
                message: "Role not found",
            });
        }
        res.status(200).json({
            message: "Role fetched successfully",
            role,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

const updateRole = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;
        const role = await Role.findById(id);
        if (!role) {
            return res.status(400).json({
                message: "Role not found",
            });
        }
        if (name) {
            role.name = name;
        }
        if (permissions) {
            const validPermissions = await Permission.find({ _id: { $in: permissions } });
            if (validPermissions.length !== permissions.length) {
                return res.status(400).json({
                    message: "Some permissions are invalid",
                });
            }
            role.permissions = [...new Set(validPermissions.map(p => p._id))];
        }
        await role.save();
        res.status(200).json({
            message: "Role updated successfully",
            role,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

const deleteRole = asyncHandler(async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(400).json({
                message: "Role not found",
            });
        }
        res.status(200).json({
            message: "Role deleted successfully",
            role,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export { createRole, getAllRoles, getRoleById, updateRole, deleteRole };