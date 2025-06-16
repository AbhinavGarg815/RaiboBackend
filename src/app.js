import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import { googleLogin } from './config/strategy/googleStrategy.js';
import { googleTokenLogin } from './config/strategy/googleTokenStrategy.js';
import authRoutes from './routes/auth.routes.js';
import { jwtLogin } from './config/strategy/jwtStrategy.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({express: true, limit: "16kb"}))
app.use(cookieParser())
app.use(express.static('public'))

app.use(passport.initialize());
passport.use('google',googleLogin);
passport.use('google-token', googleTokenLogin);
passport.use(jwtLogin);

app.use('/api/v1/auth', authRoutes);

import reviewRoutes from './routes/review.routes.js';
app.use('/api/v1/review', reviewRoutes);

import categoryRoutes from './routes/category.routes.js';
app.use('/api/v1/category', categoryRoutes);

import productRoutes from './routes/product.routes.js';
app.use('/api/v1/product', productRoutes);

import permissionRoutes from './routes/permission.routes.js';
app.use('/api/v1/permission', permissionRoutes);

import roleRoutes from './routes/role.routes.js';
app.use('/api/v1/role', roleRoutes);

import commentRoutes from './routes/comment.routes.js';

app.use('/api/v1/comment', commentRoutes);

import roomRoutes from './routes/room.routes.js';

app.use('/api/v1/room', roomRoutes);

import boardRoutes from './routes/board.routes.js';

app.use('/api/v1/board', boardRoutes);

import paymentMethodRoutes from './routes/paymentMethods.routes.js';
app.use('/api/v1/payment-methods', paymentMethodRoutes);

import companyRoutes from './routes/company.routes.js';
app.use('/api/v1/company', companyRoutes);

import imageRoutes from './routes/images.routes.js';
app.use('/api/v1/image', imageRoutes);

import addressRoutes from './routes/address.routes.js';
app.use('/api/v1/address', addressRoutes);

import cartRoutes from './routes/cart.routes.js';
app.use('/api/v1/cart', cartRoutes);

import orderRoutes from './routes/order.routes.js';
app.use('/api/v1/order', orderRoutes);

import kycRoutes from './routes/kyc.routes.js';
app.use('/api/v1/kyc', kycRoutes);

import userRoutes from './routes/user.routes.js';
app.use('/api/v1/user', userRoutes);

export default app;
