import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {Order} from '../models/order.model.js'; // Assuming you have an Order model
import Transaction from '../models/transaction.model.js'; // Import the Transaction model
import { Cart } from '../models/cart.model.js'; // Assuming you have a Cart model
import {Product} from '../models/product.model.js'; // Assuming you have a Product model
import {Company} from '../models/company.model.js'; // Assuming you have a Company model

const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?._id; // Assuming user ID is attached to the request from a middleware

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Basic validation: Check if the order belongs to the authenticated user
  if (order.user_id.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized to initiate payment for this order");
  }

  // Create a new transaction
  const transaction = await Transaction.create({
    totalAmount: order.totalAmount, // Assuming order has a totalAmount field
    referenceId: order._id,
    user: userId,
    paymentMethod: 'Simulated Method', // Replace with actual payment method if available
    status: 'Authorize',
  });

  // Initiate disbursements
  const deliveryFee = 50; // Fixed delivery fee
  const companiesInOrder = new Map();

  for (const item of order.orderItems) { // Iterate through cart items instead of order.products
    const product = await Product.findById(item.product_id);
    if (!product) {
      // Handle case where product is not found (shouldn't happen if order creation is robust)
      continue;
    }

    const companyId = product.company_id; // Assuming product model has a company field
    const amount = product.price * item.quantity;

    if (companiesInOrder.has(companyId.toString())) {
      companiesInOrder.set(companyId.toString(), companiesInOrder.get(companyId.toString()) + amount);
    } else {
      companiesInOrder.set(companyId.toString(), amount);
    }
  }

  // Create transactions for each company
  for (const [companyId, amount] of companiesInOrder.entries()) {
    await Transaction.create({
      totalAmount: amount,
      referenceId: order._id, // Still reference the main order
      user: userId, // User initiating the payment
      company: companyId, // The company receiving this disbursement
      paymentMethod: 'Disbursement', // Indicate this is a disbursement
      status: 'Authorize', // Or a suitable status for disbursement initiation
      parentTransaction: transaction._id // Reference the main payment transaction
    });
  }

  // Create transaction for delivery company
  await Transaction.create({
    totalAmount: deliveryFee,
    referenceId: order._id,
    user: userId,
    paymentMethod: 'Delivery Fee',
    status: 'Authorize',
    parentTransaction: transaction._id // Reference the main payment transaction
  });

  if (!transaction) {
    throw new ApiError(500, "Failed to create transaction record");
  }

  // Update order status to Confirmed
  order.status = 'confirmed';
  await order.save();
  // Find the cart associated with this order and update its status
  const cartId = order.cart_id; // Assuming order stores the cart ID
  if (cartId) {
    await Cart.findByIdAndUpdate(cartId, { status: "closed" });
  }

  return res.status(200).json(new ApiResponse(200, { transactionId: transaction._id }, "Payment completed"));
});

export { initiatePayment };