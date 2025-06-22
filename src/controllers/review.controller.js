import { asyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const createReview = asyncHandler(async (req, res) => {
    const { product_id,  title, content, rating } = req.body;

    //check to see if a valid order exists for the product made by the user
    const order = await findOrderByBuyerAndProduct(req.user._id, product_id);

    if( !order ) {
        res.status(400).json({
            message: "You can only review products you have purchased"
        });
        return;
    }

    const buyer_id = req.user._id;
    let product = await Product.findById(product_id);
    if (!product) {
        res.status(400).json({
            message: "Product not found"
        });
        return;
    }
    let review = await Review.findOne({ product_id, buyer_id });
    if (review) {
        res.status(400).json({
            message: "Review already exists"
        });
        return;
    }

    review = await Review.create({
        product_id,
        buyer_id,
        title,
        content,
        rating
    });
    res.status(201).json({
        message: "Review created successfully",
        review
    });
})

const getReviews = asyncHandler(async (req, res) => {
    const { product_id } =  req.params;
    const reviews = await Review.find({ product_id });
    if (!reviews) {
        res.status(400).json({
            message: "No reviews found"
        });
        return;
    }
    res.status(200).json({
        message: "Reviews fetched successfully",
        reviews
    });
})

const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        res.status(400).json({
            message: "Review not found"
        });
        return;
    }
    if (review.buyer_id != (req.user._id).toString()) {
        res.status(400).json({
            message: "Not authorized to delete this review"
        });
        return;
    }
    await review.deleteOne();
    res.status(200).json({
        message: "Review deleted successfully"
    });
})

const findOrderByBuyerAndProduct = async (buyerId, productId) => {

    const cart = await Cart.findOne({
        buyer_id: buyerId,
        "products.product_id": productId
    });

    if (!cart) return null;

    // Find the order that references this cart
    const order = await Order.findOne({ cart_id: cart._id });
    return order;
};

export { createReview, getReviews, deleteReview };
