import { asyncHandler } from "../utils/asyncHandler.js";

const loginUserGoogleCallback = asyncHandler( async (req, res) => {
    const user = req.user;
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



export { loginUserGoogleCallback};
