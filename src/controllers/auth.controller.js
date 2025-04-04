import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';

const registerUser = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Please provide all fields"
        });
        return;
    }
    const { fullname, email, password, phone } = req.body;
    const existing = await User.findOne({
        $or: [
            { email },
            { phone }
        ]
    });
    if (existing) {
        res.status(400).json({
            message: "Email or phone already exists"
        });
        return;
    }
    const user = new User({
        fullname,
        email,
        password,
        phone
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({
            message: "User not found"
        });
        return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(400).json({
            message: "Invalid credentials"
        });
        return;
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone
        }
    });
})

export { registerUser, loginUser };