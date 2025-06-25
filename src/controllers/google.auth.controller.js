import { asyncHandler } from "../utils/asyncHandler.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";


const loginUserGoogleCallback = asyncHandler(async (req, res) => {
    var user = req.user;
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const { role } = req.body;
    const roles = [role];
    const newUser = Boolean(req.newUser);

    // If the new user is a seller, create a new company for them
    if (newUser) {
        user = await User.findById(user._id);
        if (roles.includes('seller')) {
            const newCompany = new Company({
                companyName: `${user.fullname}'s Company`, // Ensure company name is set correctly
                email: user.email, // Add email to company
                owner: user._id,
            });
            await newCompany.save();
            user.companyId = newCompany._id;
            user.role = ['seller'];
        } else {
            user.role = ['buyer'];
        }
        user.save();
    }


    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 10
    });


    res.status(200).json({
        message: "Login successful",
        access_token: accessToken,
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            ...(user.role && { companyId: user.companyId }),
            points: user.points
        }
    });
})



export { loginUserGoogleCallback };
