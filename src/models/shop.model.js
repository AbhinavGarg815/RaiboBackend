import mongoose, { Schema } from "mongoose";

const shopSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String, // Assuming location is a string for simplicity, could be more complex (e.g., GeoJSON)
        required: true,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming the owner is a User
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    }
}, { timestamps: true });

export const Shop = mongoose.model("Shop", shopSchema);