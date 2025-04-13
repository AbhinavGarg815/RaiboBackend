import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import { googleLogin } from './config/strategy/googleStrategy.js';
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
passport.use(googleLogin);
passport.use(jwtLogin);

app.use('/api/v1/auth', authRoutes);

import reviewRoutes from './routes/review.routes.js';

app.use('/api/v1/review', reviewRoutes);

import categoryRoutes from './routes/category.routes.js';

app.use('/api/v1/category', categoryRoutes);

import productRoutes from './routes/product.routes.js';

app.use('/api/v1/product', productRoutes);

import paymentMethodRoutes from './routes/paymentMethods.routes.js';
app.use('/api/v1/payment-methods', paymentMethodRoutes);

import imageRoutes from './routes/images.routes.js';
app.use('/api/v1/image', imageRoutes);


import addressRoutes from './routes/address.routes.js';
app.use('/api/v1/address', addressRoutes);


export default app;
