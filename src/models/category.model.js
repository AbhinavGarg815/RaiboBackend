import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    displayImage: {
        type: String, // cloudinary URL
    },
    displayIcon: {
        type: String, // cloudinary URL
    },
    description: {
        type: String,
    }
})

export const Category = mongoose.model("Category", categorySchema)