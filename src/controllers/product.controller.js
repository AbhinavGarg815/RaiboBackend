import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { Company } from "../models/company.model.js";
import { Category } from "../models/category.model.js";
import { Image } from "../models/images.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import { ProductMapper } from "../mappers/product.mapper.js";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { upsertPoint } from "../services/qdrant.service.js";
import FormData from "form-data";
import { History } from "../models/history.model.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, quantity, category_id, company_id, images = [], imageUrls = [], discount, discount_valid_until } = req.body;

    if ([name, description, price, quantity, category_id, company_id].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All required fields are missing or empty");
    }

    const company = await Company.findById(company_id);
    const category = await Category.findById(category_id);

    if (!company) {
        res.status(400).json({
            message: "Company not found",
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
        images: images,
        imageUrls: imageUrls,
        discount,
        discount_valid_until,
        status: 'pending' // Set initial status to pending
    });

    await Image.updateMany(
        { _id: { $in: images } },
        { $set: { reference_id: product._id, type: 'product' } }
    );

    let formData = new FormData();
    const text = `${company.name} ${category.name} ${product.name} ${product.description}`;
    formData.append('text_query', text);
    const clipResponseText = await axios.post(`${process.env.CLIP_URL}/embed-text`, formData, {
        headers: {
            ...formData.getHeaders(),
        },
    });
    const textEmbedding = clipResponseText.data.text_embedding;

    let pointId = uuidv4();
    upsertPoint(textEmbedding, {
        id: pointId,
        type: 'product',
        reference_id: product._id,
        embedding_type: 'text',
    });

    const imageDocs = await Image.find({ _id: { $in: images } });
    for (const image of imageDocs) {
        const imageFormData = new FormData();
        imageFormData.append('image_url', image.url);
        const clipResponseImage = await axios.post(`${process.env.CLIP_URL}/embed-image`, imageFormData, {
            headers: {
                ...imageFormData.getHeaders(),
            },
        });
        const imageEmbedding = clipResponseImage.data.image_embedding;

        let pointId = uuidv4(); // Generate a unique ID for the point
        upsertPoint(imageEmbedding, {
            id: pointId,
            type: 'product',
            url: image.url,
            reference_id: product._id,
            embedding_type: 'image',
        });

        const combinedFormData = new FormData();
        combinedFormData.append('image_url', image.url);
        combinedFormData.append('text_query', text);
        const clipResponseCombined = await axios.post(`${process.env.CLIP_URL}/embed-image-text`, combinedFormData, {
            headers: {
                ...combinedFormData.getHeaders(),
            },
        });
        const combinedEmbedding = clipResponseCombined.data.combined_embedding;
        pointId = uuidv4(); // Generate a unique ID for the point
        upsertPoint(combinedEmbedding, {
            id: pointId,
            type: 'product',
            url: image.url,
            reference_id: product._id,
            embedding_type: 'combined',
        });
    }

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
        // Fetch image URLs from the Image model
    const productDetails = await Promise.all(products.map(async (product) => {
        const isLikedByUser = user_id ? product.likedBy.includes(user_id) : false;
        const comments = await Comment.find({ reference: product._id, onModel: 'Product', type: 'external', isDeleted: false })
            .select('_id content parentComment');
        const images = await Image.find({ _id: { $in: product.images } }).select('url');
        return ProductMapper.toProductDetailResponse(product.toObject(), comments || [], isLikedByUser, images);
    }));

    res.status(200).json({
        message: "Products fetched successfully",
        products: productDetails,
    });
})

const getAllProductsBuyer = asyncHandler(async (req, res) => {

    const user_id = req.user?._id; // Get user ID if authenticated
    const products = await Product.find().populate('category_id').populate('company_id'); // Only fetch approved products

    const productDetails = await Promise.all(products.map(async (product) => {
        const isLikedByUser = user_id ? product.likedBy.includes(user_id) : false;
        const comments = await Comment.find({ reference: product._id, onModel: 'Product', type: 'external', isDeleted: false })
            .select('_id content parentComment');
        const images = await Image.find({ _id: { $in: product.images } }).select('url');
        return ProductMapper.toProductDetailResponse(product, comments || [], isLikedByUser, images);
    }));

    res.status(200).json({
        products: productDetails,
    });
})

const getProductById = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const productId = req.params.id; // Assuming user_id is available in the request body or can be retrieved from the session/auth
    const product = await Product.findById(productId)
        .populate('category_id')
        .populate('company_id');
    if (!product) {
        res.status(400).json({
            message: "Product not found",
        });
        return;
    }

    addProductToHistory(productId, user_id); // This should not be blocking the request

    // Fetch external comments for the product
    const isLikedByUser = true ? product.likedBy.includes(user_id) : false;
    const comments = await Comment.find({ reference: product._id, onModel: 'Product', type: 'external', isDeleted: false })
        .select('_id content parentComment');
    const images = await Image.find({ _id: { $in: product.images } }).select('url');
    // Determine if the user has liked the product
    const productDetailResponse = ProductMapper.toProductDetailResponse(product, comments, isLikedByUser,images);
    res.status(200).json({
        product: productDetailResponse,
    });
});

const addSimilarProduct = asyncHandler(async (req, res) => {
    const { similarProductId } = req.body;
    const { productId } = req.params;

    if (!productId || !similarProductId) {
        throw new ApiError(400, "Product ID and Similar Product ID are required.");
    }

    if (productId === similarProductId) {
        throw new ApiError(400, "Product ID and Similar Product ID cannot be the same.");
    }

    const [product, similarProduct] = await Promise.all([
        Product.findById(productId),
        Product.findById(similarProductId)
    ]);

    if (!product) {
        throw new ApiError(404, `Product with ID ${productId} not found.`);
    }

    if (!similarProduct) {
        throw new ApiError(404, `Similar Product with ID ${similarProductId} not found.`);
    }

    // Add similarProductId to product's similarProducts array
    if (!product.similarProducts.includes(similarProductId)) {
        product.similarProducts.push(similarProductId);
        await product.save();
    }

    // Add productId to similarProduct's similarProducts array
    if (!similarProduct.similarProducts.includes(productId)) {
        similarProduct.similarProducts.push(productId);
        await similarProduct.save();
    }

    res.status(200).json({
        message: "Similar product linked successfully.",
        product: product.similarProducts,
        similarProduct: similarProduct.similarProducts
    });
});

const removeSimilarProduct = asyncHandler(async (req, res) => {
    const { similarProductId } = req.body;
    const { productId } = req.params;

    if (!productId || !similarProductId) {
        throw new ApiError(400, "Product ID and Similar Product ID are required.");
    }

    if (productId === similarProductId) {
        throw new ApiError(400, "Product ID and Similar Product ID cannot be the same.");
    }

    const [product, similarProduct] = await Promise.all([
        Product.findById(productId),
        Product.findById(similarProductId)
    ]);

    if (!product) {
        throw new ApiError(404, `Product with ID ${productId} not found.`);
    }

    if (!similarProduct) {
        throw new ApiError(404, `Similar Product with ID ${similarProductId} not found.`);
    }

    // Remove similarProductId from product's similarProducts array
    const productIndex = product.similarProducts.indexOf(similarProductId);
    if (productIndex > -1) {
        product.similarProducts.splice(productIndex, 1);
        await product.save();
    }

    // Remove productId from similarProduct's similarProducts array
    const similarProductIndex = similarProduct.similarProducts.indexOf(productId);
    if (similarProductIndex > -1) {
        similarProduct.similarProducts.splice(similarProductIndex, 1);
        await similarProduct.save();
    }

    res.status(200).json({
        message: "Similar product unlinked successfully.",
        product: product.similarProducts,
        similarProduct: similarProduct.similarProducts
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
    const company_id = req.params.company_id;
    if (!company_id) {
        throw new ApiError(400, "Company ID is required");
    }
    const product = await Product.findOneAndDelete({ _id: req.params.id, company_id: req.params.company_id });
    if (!product) {
        throw new ApiError(404, "Product not found for this company");
    }
    res.status(200).json({
        message: "Product deleted successfully",
        product,
    });
})

const getProductInfoById = asyncHandler(async (req, res) => {
    const user_id = req.user._id;
    const product = await Product.findById(req.params.id).select("-quantity -archived").populate('category_id').populate('company_id')
    if (!product || product.archived) {
        throw new ApiError(404, "Product not found");
    }
    res.status(200).json({
        message: "Product fetched successfully",
        product,
    });
});

const getPendingProducts = asyncHandler(async (req, res) => {
    // Assuming only admin can access this route, you might add an admin middleware here
    const pendingProducts = await Product.find({ status: 'pending' })
        .populate('category_id')
        .populate('company_id');

    res.status(200).json({
        message: "Pending products fetched successfully",
        products: pendingProducts,
    });
});

const approveProduct = asyncHandler(async (req, res) => {
    // Assuming only admin can access this route
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.status === 'approved') {
        throw new ApiError(400, "Product is already approved");
    }

    product.status = 'approved';
    await product.save();

    res.status(200).json({
        message: "Product approved successfully",
        product,
    });
});

const rejectProduct = asyncHandler(async (req, res) => {
    // Assuming only admin can access this route
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    product.status = 'rejected';
    await product.save();

    res.status(200).json({
        message: "Product rejected successfully",
        product,
    });
});

const handleLike = asyncHandler(async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user._id;
    if (!product_id) {
        throw new ApiError(400, "Product ID and User ID are required");
    }

    const product = await Product.findById(product_id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const likedIndex = product.likedBy.indexOf(user_id);
    const message = likedIndex === -1 ? "Product liked successfully" : "Product unliked successfully";
    if (likedIndex === -1) {
        product.likedBy.push(user_id);
        product.likesCount++;
    } else {
        product.likedBy.splice(likedIndex, 1);
        product.likesCount--;
    }

    await product.save();

    res.status(200).json({ success: true, message: message, likesCount: product.likesCount });
});

//TODO: Add handlers for history management in a separate file
const addProductToHistory = async function (productId, user_id) {
            const historyEntry = new History({ productId, viewedBy: user_id });
            historyEntry.save().catch(err => {
                console.error("Error saving history entry:", err);
            });
        }

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductInfoById,
    getAllProductsBuyer,
    handleLike,
    getPendingProducts,
    approveProduct,
    rejectProduct,
    addSimilarProduct,
    removeSimilarProduct
};
