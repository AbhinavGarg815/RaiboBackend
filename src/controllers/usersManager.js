import { validationResult } from "express-validator";
import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

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

async function login(req, res, next) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { email, password } = req.body;

  let user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({
      error: "Email not found.",
    });
  }

  bcrypt.compare(password, user.password).then((isMatch) => {
    if (isMatch) {
      const key = process.env.JWT_SECRET;
      // User's password is correct and we need to send the JSON Token for that user
      const payload = {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
      };
      jwt.sign(
        payload,
        key,
        {
          expiresIn: 604800,
        },
        (err, token) => {
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
          });
        },
      );
    } else {
      return res.status(401).json({
        error: "Incorrect password.",
        success: false,
      });
    }
  });
}

async function profile(req, res, next) {
  return res.json({
    user: req.user,
  });
}

export { signUp, login, profile };
