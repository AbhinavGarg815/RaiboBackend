import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded._id);
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    next();
});

export { authMiddleware };