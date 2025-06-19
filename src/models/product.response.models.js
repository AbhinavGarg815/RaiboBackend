export class ProductCardResponse {
    constructor(_id, name, price, quantity) {
        this._id = _id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}

export class ProductDetailResponse {
    constructor({
        _id,
        name,
        description,
        price,
        quantity,
        category_id,
        company_id,
        images,
        imageUrls,
        discount,
        discount_valid_until,
        average_rating,
        total_ratings,
        __v,
        status,
        likesCount,
        isLikedByUser,
        comments
    }) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category_id = category_id;
        this.company_id = company_id;
        this.images = images;
        this.imageUrls = imageUrls;
        this.discount = discount;
        this.discount_valid_until = discount_valid_until;
        this.average_rating = average_rating;
        this.total_ratings = total_ratings;
        this.__v = __v;
        this.status = status;
        this.likesCount = likesCount;
        this.isLikedByUser = isLikedByUser;
        this.comments = comments;
    }
}