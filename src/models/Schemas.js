const mongoose = require("mongoose");

// Company Schema
const companySchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  phone_number: { type: String },
  address: { type: String },
  state: { type: String },
  zipcode: { type: String },
});

// Category Schema
const categorySchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
});

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  image: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  count: { type: Number },
  discount: { type: Number },
  discount_valid_until: { type: Date },
  average_rating: { type: Number },
  image_embedding: { type: Array },
  text_embedding: { type: Array },
});

// User Schema
const userSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String },
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  reviewer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String },
  body: { type: String },
  rating: { type: Number },
});

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

// Address Schema
const addressSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver_name: { type: String },
  state: { type: String },
  zipcode: { type: String },
  country: { type: String },
  phone_number: { type: String },
});

// Orders Schema
const orderSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  type: { type: String },
  created_at: { type: Date, default: Date.now },
  delivered_at: { type: Date },
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

// Search History Schema
const searchHistorySchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  text: { type: String },
  image: { type: String },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Logistics Schema
const logisticsSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  status: { type: String },
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
});

// Merchant Schema
const merchantSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// Role Schema
const roleSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  role: { type: String, required: true },
});

// Payment Details Schema
const paymentDetailsSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  card_number: { type: String, required: true },
  card_holder_name: { type: String, required: true },
  valid_upto: { type: Date, required: true },
});

// Models
const Company = mongoose.model("Company", companySchema);
const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);
const Review = mongoose.model("Review", reviewSchema);
const Wishlist = mongoose.model("Wishlist", wishlistSchema);
const Address = mongoose.model("Address", addressSchema);
const Order = mongoose.model("Order", orderSchema);
const Cart = mongoose.model("Cart", cartSchema);
const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);
const Logistics = mongoose.model("Logistics", logisticsSchema);
const Session = mongoose.model("Session", sessionSchema);
const Merchant = mongoose.model("Merchant", merchantSchema);
const Role = mongoose.model("Role", roleSchema);
const PaymentDetails = mongoose.model("PaymentDetails", paymentDetailsSchema);

module.exports = {
  Company,
  Category,
  Product,
  User,
  Review,
  Wishlist,
  Address,
  Order,
  Cart,
  SearchHistory,
  Logistics,
  Session,
  Merchant,
  Role,
  PaymentDetails,
};
