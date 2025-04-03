import mongoose from "mongoose";

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

const Order = mongoose.model("Order", orderSchema);

export default Order;
