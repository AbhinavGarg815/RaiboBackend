
export class OrderItemResponse {
    constructor(product_id, quantity, status) {
        this.product_id = product_id;
        this.quantity = quantity;
        this.status = status;
    }
}

export class OrderResponse {
    constructor(_id, user_id, cart_id, address, status, totalAmount, payment_method, method_id, receiver_name, receiver_phone, delivery_date, orderItems, createdAt, updatedAt) {
        this._id = _id;
        this.user_id = user_id;
        this.cart_id = cart_id;
        this.address = address;
        this.status = status;
        this.totalAmount = totalAmount;
        this.payment_method = payment_method;
        this.method_id = method_id;
        this.receiver_name = receiver_name;
        this.receiver_phone = receiver_phone;
        this.delivery_date = delivery_date;
        this.orderItems = orderItems;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
