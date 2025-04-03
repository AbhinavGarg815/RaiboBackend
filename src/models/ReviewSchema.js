import mongoose from "mongoose";

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

const Review = mongoose.model("Review", reviewSchema);

export default Review;
