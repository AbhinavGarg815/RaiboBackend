import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  role: { type: String, required: true },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
