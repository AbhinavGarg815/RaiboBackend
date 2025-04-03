import mongoose, { Schema } from "mongoose";

const textSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    embedding: {
        type: [Number],
    }
})

export const Text = mongoose.model("Text", textSchema)