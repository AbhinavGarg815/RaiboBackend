import "dotenv/config";
import mongoose from "mongoose";

import Address from "./AddressSchema.js";
import Cart from "./CartSchema.js";
import Category from "./CategorySchema.js";
import Logistics from "./LogisticsSchema.js";
import Merchant from "./MerchantSchema.js";
import Order from "./OrderSchema.js";
import PaymentDetails from "./PaymentDetailsSchema.js";
import Product from "./ProductSchema.js";
import Review from "./ReviewSchema.js";
import Role from "./RoleSchema.js";
import SearchHistory from "./SearchHistorySchema.js";
import Session from "./SessionSchema.js";
import User from "./UserSchema.js";
import Wishlist from "./WishlistSchema.js";

const dbURL = process.env.MONGODB_URI;

const connectDB = async () => {
  mongoose.connection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:"),
  );
  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });
  return mongoose.connect(dbURL);
};

export { connectDB };

const models = {
  User,
  Cart,
  Wishlist,
  Address,
  Order,
  Review,
  Product,
  Category,
  Session,
  Merchant,
  Role,
  PaymentDetails,
  SearchHistory,
  Logistics,
};
export default models;
