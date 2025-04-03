import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true }, // Primary Key
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  }, // Foreign Key
  image: { type: String }, // URI
  name: { type: String, required: true },
  description: { type: String },
  price: { type: mongoose.Types.Double, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Foreign Key
  count: { type: Number },
  discount: { type: mongoose.Types.Double },
  discount_valid_until: { type: Date },
  average_rating: { type: Number },
  image_embedding: { type: Array },
  text_embedding: { type: Array },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
