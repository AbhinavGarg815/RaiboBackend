import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  text: { type: String },
  image: { type: String },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
