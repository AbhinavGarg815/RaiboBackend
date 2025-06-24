import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { cardDetails } from "../models/cardDetails.model.js";
import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.model.js";
import { mapOrderToOrderResponse } from "../mappers/order.mapper.js";
import { OrderResponse } from "../models/order.response.models.js";

const createOrder = asyncHandler(async (req, res) => {
  try {
    const {
      cart_id,
      address_id,
      payment_method,
      method_id,
      receiver_name,
      receiver_phone,
      delivery_date,
    } = req.body;
    const cart = await Cart.findOne({ _id: cart_id, status: "open" });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Invalid Cart" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.product_id} not found` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price, // Add the price here
        status: 'Pending'
      });
    }
    totalAmount += 50; // Add fixed delivery fee
    
    const method = await cardDetails.findById(method_id);
    if (!method) {
      return res.status(400).json({ error: "Invalid Method" });
    }

    const address = await Address.findById(address_id);
    if (!address) {
      return res.status(400).json({ error: "Invalid Address" });
    }

    const order = await Order.create({
      user_id: req.user._id,
      cart_id: cart_id,
      address: address,
      payment_method: payment_method,
      method_id: method_id,
      receiver_name: receiver_name,
      receiver_phone: receiver_phone,
      delivery_date: delivery_date,
      totalAmount: totalAmount,
      orderItems: orderItems, // Add the order items
    });
    
    const orderResponse = mapOrderToOrderResponse(order);
    return res.status(201).json({ message: "Order Created Successfully", order: orderResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const orderResponse = mapOrderToOrderResponse(order);
    res.status(200).json(orderResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getOrdersByUserId = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    const ordersResponse = orders.map(order => mapOrderToOrderResponse(order));
    res.status(200).json({ message: "Fetched Orders Successfully", orders: ordersResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
);

export { createOrder, getOrderById, getOrdersByUserId };
