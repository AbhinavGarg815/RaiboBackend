import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json({
        message: "Category created successfully",
        category,
    });
})

const getCategories = asyncHandler(async (req, res) => {
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

export { createCategory, getCategories, getCategoryById, deleteCategory };