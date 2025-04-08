import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { Category } from "../models/category.model.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, quantity, category_id, company_id, images, discount, discount_valid_until } = req.body;
    const company = await Company.findById(company_id);
    const category = await Category.findById(category_id);
    if (!company) {
        res.status(400).json({
            message: "Company not found",
        });
        return;
    }
    if (!category) {
        res.status(400).json({
            message: "Category not found",
        });
        return;
    }
    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        category_id,
        company_id,
        images,
        discount,
        discount_valid_until
    });
    res.status(201).json({
        message: "Product created successfully",
        product,
    });
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().populate('category_id').populate('company_id');
    res.status(200).json({
        message: "Products fetched successfully",
        products,
    });
})

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category_id').populate('company_id');
    if (!product) {
        res.status(400).json({
            message: "Product not found",
        });
        return;
    }
    res.status(200).json({
        message: "Product fetched successfully",
        product,
    });
})

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateFields = {};
    const fields = ['name', 'description', 'price', 'quantity', 'category_id', 'company_id', 'images', 'discount', 'discount_valid_until'];
    fields.forEach(field => {
        if (req.body[field]) {
            updateFields[field] = req.body[field];
        }
    })
    if ("company_id" in updateFields) {

        const company = await Company.findById(updateFields.company_id);
        if (!company) {
            res.status(400).json({
                message: "Company not found",
            });
            return;
        }
    }
    if ("category_id" in updateFields) {
        const category = await Category.findById(updateFields.category_id);
        if (!category) {
            res.status(400).json({
                message: "Category not found",
            });
            return;
        }
    }
    const updateProduct = await Product.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
    )
    if (!updateProduct) {
        res.status(400).json({
            message: "Product not found",
        });
        return;
    }
    res.status(200).json({
        message: "Product updated successfully",
        updateProduct,
    });
})

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(400).json({
            message: "Product not found",
        });
        return;
    }
    await product.deleteOne();
    res.status(200).json({
        message: "Product deleted successfully",
    });
})

const getProductsByCategory = asyncHandler(async (req, res) => {
    const { category_id } = req.params;
    const products = await Product.find({ category_id }).populate('category_id').populate('company_id');
    if (!products) {
        res.status(400).json({
            message: "No products found",
        });
        return;
    }
    res.status(200).json({
        message: "Products fetched successfully",
        products,
    });
})

const getProductsByCompany = asyncHandler(async (req, res) => {
    const { company_id } = req.params;
    const products = await Product.find({ company_id }).populate('category_id').populate('company_id');
    if (!products) {
        res.status(400).json({
            message: "No products found",
        });
        return;
    }
    res.status(200).json({
        message: "Products fetched successfully",
        products,
    });
})

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsByCategory, getProductsByCompany };