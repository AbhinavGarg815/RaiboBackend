import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Merchant = mongoose.model("Merchant", merchantSchema);

export default Merchant;
