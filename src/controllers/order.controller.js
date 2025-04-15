import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { cardDetails } from "../models/cardDetails.model.js";
import { Address } from "../models/address.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

    const method = await cardDetails.findById(method_id);
    if (!method) {
      return res.status(400).json({ error: "Invalid Method" });
    }

    const address = await Address.findById(address_id);
    if (!address) {
      return res.status(400).json({ error: "Invalid Address" });
    }

    await Cart.findByIdAndUpdate(cart_id, { status: "closed" });

    const order = await Order.create({
      cart_id: cart_id,
      address: address,
      payment_method: payment_method,
      method_id: method_id,
      receiver_name: receiver_name,
      receiver_phone: receiver_phone,
      delivery_date: delivery_date,
    });
    return res
      .status(201)
      .json({ message: "Order Created Successfully", order });
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
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { createOrder, getOrderById };
