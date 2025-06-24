import { OrderResponse, OrderItemResponse } from '../models/order.response.models.js';

export const mapOrderToOrderResponse = (order) => {
    if (!order) {
        return null;
    }

    const orderItems = order.orderItems.map(item => {
        return new OrderItemResponse(
            item.product_id ? item.product_id.toString() : null,
            item.quantity,
            item.status
        );
    });

    return new OrderResponse(
        order._id ? order._id.toString() : null,
        order.user_id ? order.user_id.toString() : null,
        order.cart_id ? order.cart_id.toString() : null,
        order.address ? order.address.toString() : null,
        order.status,
        order.totalAmount,
        order.payment_method,
        order.method_id ? order.method_id.toString() : null,
        order.receiver_name,
        order.receiver_phone,
        order.delivery_date ? order.delivery_date.toISOString() : null,
        orderItems,
        order.createdAt ? order.createdAt.toISOString() : null,
        order.updatedAt ? order.updatedAt.toISOString() : null
    );
};
