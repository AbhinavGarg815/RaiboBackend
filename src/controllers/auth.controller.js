import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import nodemailer from 'nodemailer'

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

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const tempUser = new TempUser({
        fullname,
        email,
        password,
        phone,
        verificationToken,
        verificationExpires: Date.now() + 3600000 // 1 hour
    });
    await tempUser.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: tempUser.email,
        subject: "Email Verification",
        text: `Please verify your email by clicking the following link: \n\n ${process.env.CLIENT_URL}/verify-email/${verificationToken} \n\n If you did not request this, please ignore this email.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending verification email:", err);
            res.status(500).json({ message: "Error sending verification email" });
            return;
        }
        console.log("Email sent:", info.response);
        res.status(200).json({
            message: "Verification email sent. Please check your inbox."
        });
    });    
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

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const tempUser = await TempUser.findOne({
        verificationToken: token,
        verificationExpires: { $gt: Date.now() },
    });

    if (!tempUser) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = new User({
        fullname: tempUser.fullname,
        email: tempUser.email,
        password: tempUser.password,
        phone: tempUser.phone,
        isVerified: true
    });
    await tempUser.remove(); // Remove temporary user after successful verification

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
})



export { registerUser, loginUser, logoutUser, refreshToken, verifyEmail };