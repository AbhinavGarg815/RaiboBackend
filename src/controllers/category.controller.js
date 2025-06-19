// Suggested code may be subject to a license. Learn more: ~LicenseLog:3666641881.
import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const displayImageLocalPath = req.files?.displayImage?.[0]?.path;
    const displayIconLocalPath = req.files?.displayIcon?.[0]?.path;

    if (!name) {
        return res.status(400).json(new ApiError(400, "Category name is required"));
    }

    let displayImageUrl;
 if (displayImageLocalPath) {
 const displayImage = await uploadOnCloudinary(displayImageLocalPath);
 if (displayImage) displayImageUrl = displayImage.url;
    }
    let displayIconUrl;
 if (displayIconLocalPath) {
 const displayIcon = await uploadOnCloudinary(displayIconLocalPath);
 if (displayIcon) displayIconUrl = displayIcon.url;
    }
    const category = await Category.create({ name, description, displayImageUrl, displayIconUrl });
    res.status(201).json({
        message: "Category created successfully",
        category,
    });
})

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({
        message: "Categories fetched successfully",
        categories,
    });
})

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(400).json({
            message: "Category not found",
        });
        return;
    }
    res.status(200).json({
        message: "Category fetched successfully",
        category,
    });
})

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(400).json({
            message: "Category not found",
        });
        return;
    }
    await category.deleteOne();
    res.status(200).json({
        message: "Category deleted successfully",
    });
})

const updateCategory = asyncHandler(async (req, res) => {
    const { name, description, displayImageUrl, displayIconUrl  } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
 return res.status(404).json(new ApiError(404, "Category not found"));
    }
    if (name) category.name = name;
    if (description) category.description = description;
    if (displayImageUrl) category.displayImageUrl = displayImageUrl;
    if (displayIconUrl) category.displayIconUrl = displayIconUrl;
    await category.save();
    res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
})

export { createCategory, getAllCategories, getCategoryById, deleteCategory, updateCategory };