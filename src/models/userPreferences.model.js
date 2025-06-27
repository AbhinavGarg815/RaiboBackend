import mongoose, { Schema } from "mongoose";

const userPreferenceSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalInteractions: {
        type: Number,
        default: 0
    },
    categoryPreferences: [{
        category: {
            type: String,
            required: true
        },
        score: Number,
        interactionCount: Number
    }],
    pricePreferences: {
        averagePrice: Number,
        priceRange: {
            min: Number,
            max: Number
        }
    },
    interactionWeights: {
        view: { type: Number, default: 1 },
        click: { type: Number, default: 2 },
        add_to_cart: { type: Number, default: 5 },
        purchase: { type: Number, default: 10 },
        like: { type: Number, default: 3 },
        share: { type: Number, default: 4 },
        review: { type: Number, default: 6 }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);