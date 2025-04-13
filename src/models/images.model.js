import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    embedding: {
        type: [Number],
    }
},
{
    timestamps: true
});

export const Image = mongoose.model("Image", imageSchema);
