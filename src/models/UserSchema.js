import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  roles: {
    type: mongoose.Schema.Types.Array,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
