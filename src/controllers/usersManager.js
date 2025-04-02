import { validationResult } from "express-validator";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";

async function signUp(req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { username, email, password } = req.body;

  let user = await User.findOne({ username: username });
  if (user) {
    return res.status(400).json({
      error: "Username already taken.",
    });
  }

  user = await User.findOne({ email: email });
  if (user) {
    return res.status(400).json({
      error: "Email already registered.",
    });
  }

  let newUser = new User({
    username,
    email,
    password,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        return res.status(201).json({
          success: true,
          msg: "User Registered Successfully",
        });
      });
    });
  });
}

export { addUser, signUp };
