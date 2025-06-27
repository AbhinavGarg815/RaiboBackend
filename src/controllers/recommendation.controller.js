import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { getUserRecommendations } from "../services/recommendation.service.js";
import { Product } from "../models/product.model.js";
import { Comment } from "../models/comment.model.js";
import { Image } from "../models/images.model.js";
import { ProductMapper } from "../mappers/product.mapper.js";

const getRecommendations = asyncHandler(async(req, res) => {
    try {
        const TIMEOUT = 15000;
        const userId = req.body.userId;
        const limit = req.body ? req.body.limit : 20;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Recommendation service timed out')), TIMEOUT)
        );

        const recommendations = await Promise.race([
            getUserRecommendations(userId, limit),
            timeoutPromise
        ]);

        // Extract productIds from recommendations
        const productIds = recommendations.map(rec => rec.product_id);

        // Fetch products from the database
        const products = await Product.find({ _id: { $in: productIds } })
            .populate('category_id')
            .populate('company_id');

        // Fetch product details with images, comments, and like status
        const productDetails = await Promise.all(products.map(async (product) => {
            const isLikedByUser = userId ? product.likedBy.includes(userId) : false;
            const comments = await Comment.find({
            reference: product._id,
            onModel: 'Product',
            type: 'external',
            isDeleted: false
            }).select('_id content parentComment');
            const images = await Image.find({ _id: { $in: product.images } }).select('url');
            return ProductMapper.toProductDetailResponse(product.toObject(), comments || [], isLikedByUser, images);
        }));

        // Order the products as per recommendations
        const orderedProducts = productIds.map(id =>
            productDetails.find(product => product._id.toString() === id)
        ).filter(Boolean);

        // Replace recommendations with orderedProducts for response
        recommendations.length = 0;
        recommendations.push(...orderedProducts);

        res.status(200).json({
            message: "User recommendations retrieved successfully",
            data: recommendations
        });
    } catch (error) {
        res.status(500).json({ message: "Recommendation service failed", error: error.message });
    }
});

export { getRecommendations };