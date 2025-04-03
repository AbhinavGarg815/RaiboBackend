import mongoose from "mongoose";

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

const Address = mongoose.model("Address", addressSchema);

export default Address;
