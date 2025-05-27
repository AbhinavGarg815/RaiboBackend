import { Role } from "../models/role.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Permission } from "../models/permission.model.js";

const createRole = asyncHandler(async (req, res) => {
    const { name, permissions } = req.body;
    const role = await Role.create({ name, permissions });
    res.status(201).json({
        message: "Role created successfully",
        role,
    });
})

const getAllRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find().populate('permissions');
    res.status(200).json({
        message: "Roles fetched successfully",
        roles,
    }); 
})

const getRoleById = asyncHandler(async (req, res) => {
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
})

const updateRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true });
    if (!role) {
        return res.status(400).json({
            message: "Role not found",
        });
    }
    res.status(200).json({
        message: "Role updated successfully",
        role,
    });
})

const deleteRole = asyncHandler(async (req, res) => {
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
})

export { createRole, getAllRoles, getRoleById, updateRole, deleteRole };