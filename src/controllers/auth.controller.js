import { User } from '../models/user.model.js';
import { enqueJob } from '../utils/job.handler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Please provide all fields"
        });
        return;
    }
    const { fullname, email, password, phone } = req.body;

    if (!fullname || !email || !password || !phone) {
        res.status(400).json({
            message: "Please provide all fields"
        });
        return;
    }

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

    if (!email || !password) {
        res.status(400).json({
            message: "Please provide email and password"
        });
        return;
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400).json({
            message: "User not found"
        });
        return;
    }

    if(!user.password) {
        res.status(400).json({
            message: "Please login with Google"
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
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 10
    })
    res.status(200).json({
        message: "Login successful",
        accessToken,
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone
        }
    });
})

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })
    res.status(200).json({
        message: "Logged out successfully"
    })
})

const refreshToken = asyncHandler (async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token not found" });
    }
    
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
        return res.status(403).json({ message: "User not found" });
    }
    const newAccessToken = user.generateAccessToken();

    return res.status(200).json({
        accessToken: newAccessToken
    });
});

const verifyUser = asyncHandler(async (req, res) => {

    try{
    const { verificationToken } = req.params;

    const user = await User.findOne({verificationToken});

    if(!user) {
        return res.status(400).json({
            message: "Invalid verification code"
        });
    }

    else {
        user.isVerified = true;
        await user.save();
        return res.status(200).json({
            message: "User verified successfully"
        });
    }}
    catch (error)
    {
        return res.status(500).json({
            message: "An error occurred while verifying the user",
            error: error.message
        });
    }

});

const requestVerify = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const user = await User.findById(id);

    if(user.isVerified) {
        return res.status(400).json({
            message: "User is already verified"
        });
    }

    if(!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const verificationToken = [...Array(32)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    user.verificationToken = verificationToken;
    const values = {name: user.fullname, ctaLink: `${process.env.CLIENT_URL}/auth/verify/${verificationToken}`,ctaText:"Click here"}
    await enqueJob([user._id],"verify-user-email", "email", values );


    await user.save();

    return res.status(200).json({
        message: "Verification email sent"
    });



});

export { registerUser, loginUser, logoutUser, refreshToken , verifyUser, requestVerify};
