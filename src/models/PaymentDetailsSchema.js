import mongoose from "mongoose";

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

const PaymentDetails = mongoose.model("PaymentDetails", paymentDetailsSchema);

export default PaymentDetails;
