import {
    ProductCardResponse,
    ProductDetailResponse,
} from "../models/product.response.models.js";

class ProductMapper {
    static toProductCardResponse(product) {
        return new ProductCardResponse(
            product._id,
            product.externalProductId,   
            product.name,
            product.price,
            product.quantity
        );
    }

    static toProductDetailResponse(product, comments = [], isLikedByUser = false, images = []) {
        return new ProductDetailResponse({
            _id: product._id,
            name: product.name,
            externalProductId: product.externalProductId,
            price: product.price,
            quantity: product.quantity,
            description: product.description, // Add description
            category_id: product.category_id, // Add category_id object
            company_id: product.company_id, // Add company_id object
            images: product.images, // Add images array
            imageUrls: images.length > 0 ? images.map(image => image.url) : (product.imageUrls.length > 0 ? product.imageUrls : ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop", "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1587&auto=format&fit=crop"]), // Add imageUrls array
            discount: product.discount, // Add discount
            discount_valid_until: product.discount_valid_until, // Add discount_valid_until
            average_rating: product.average_rating, // Add average_rating
            total_ratings: product.total_ratings, // Add total_ratings
            __v: product.__v, // Add __v
            status: product.status, // Add status
            likesCount: product.likesCount, // Add likesCount
            isLikedByUser, // Add isLikedByUser
            comments,
            model3dUrl : product.threeDModel, // Add comments array
            similarProducts: product.similarProducts // Add similarProducts array
        });
    }
}

export {
    ProductMapper
};