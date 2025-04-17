import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
    googleId:{
        type: String,
        validate: {
            validator: function (value) {
              // Google ID is required if email and password are not provided
              return this.email || this.password || value;
            },
            message: "Google ID is required if email and password are not provided.",
          },
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
              // Email is required if Google ID is not provided
              return this.googleId || value;
            },
            message: "Email is required if Google ID is not provided.",
          },
    },
    password: {
        type: String,

    validate: {
                validator: function (value) {
                    // Password is required if Google ID is not provided
                    return this.googleId || value;
                },
                 message: "Password is required if Google ID is not provided.",
            },
    },
    phone: {
        type: String,
        trim: true
    },
    role: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
}, 
{
    timestamps: true,
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}



userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            fullname: this.fullname,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.index(
    { phone: 1 },
    {
      unique: true,
      partialFilterExpression: { phone: { $exists: true, $ne: null } },
    }
  );

export const User = mongoose.model('User', userSchema);
