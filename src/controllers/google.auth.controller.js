import { asyncHandler } from "../utils/asyncHandler.js";

const loginUserGoogleCallback = asyncHandler( async (req, res) => {
    const user = req.user;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 10
    });


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



export { loginUserGoogleCallback};
