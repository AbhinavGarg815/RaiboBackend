import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
})

export const Permission = mongoose.model("Permission", permissionSchema)