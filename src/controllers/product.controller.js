import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { Category } from "../models/category.model.js";
import { Image } from "../models/images.model.js";
import { ApiError } from "../utils/ApiError.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, quantity, category_id, company_id, images = [], discount, discount_valid_until } = req.body;

    if ([name, description, price, quantity, category_id, company_id].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All required fields are missing or empty");
    }

    const company = await Company.findById(company_id);
    // const category = await Category.findById(category_id);

    if (!company) {
        res.status(400).json({
            message: "Company not found", 
        });
        return;
    }
    // if (!category) {
    //     res.status(400).json({
    //         message: "Category not found",
    //     }); 
    //     return; 
    // }
    const product = await Product.create({
        name,
        description,
        price,
        quantity,
        category_id,
        company_id,
        imageUrls: images,
        discount,
        discount_valid_until
    }); 

    // images.forEach(async (image) => {
    //     await Image.findByIdAndUpdate(image, { reference_id: product._id } );
    // }); 

    res.status(201).json({
        message: "Product created successfully", product,
    });
})

const getAllProducts = asyncHandler(async (req, res) => {
    const { company_id } = req.body;
    if (!company_id) {
        throw new ApiError(400, "Company ID is required");
    }
    const products = await Product.find({ company_id }).populate('category_id').populate('company_id');

    res.status(200).json({
        message: "Products fetched successfully",
        products,
    });
})

const getAllProductsBuyer = asyncHandler(async (req, res) => {

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
});

const updateProduct = asyncHandler(async (req, res) => { 
    const { company_id } = req.body;
    if (!company_id) {
 throw new ApiError(400, "Company ID is required");
    }
    const updateFields = {};
    const fields = ['name', 'description', 'price', 'quantity', 'category_id', 'company_id', 'imageUrls', 'discount', 'discount_valid_until'];
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
        { _id: req.params.id, company_id }, updateFields,
        { new: true }
    ) 
    if (!updateProduct) {
        throw new ApiError(404, "Product not found");
    }
    res.status(200).json({
        message: "Product updated successfully", updateProduct,
    });
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { company_id } = req.body;
    if (!company_id) {
 throw new ApiError(400, "Company ID is required");
    }
    const product = await Product.findOneAndDelete({ _id: req.params.id, company_id });
    if (!product) {
 throw new ApiError(404, "Product not found for this company");
    }
    res.status(200).json({
 message: "Product deleted successfully",
 product,
    });
})

const getProductInfoById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).select("-quantity -archived").populate('category_id').populate('company_id');
    if (!product || product.archived) {
        throw new ApiError(404, "Product not found");
    }
    res.status(200).json({
        message: "Product fetched successfully",
        product,
    });
});

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductInfoById,
    getAllProductsBuyer
};