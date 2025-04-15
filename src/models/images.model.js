import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema({

    url: {
        type: String,
        required: true,
        trim: true,
    },
    embedding: {
        type: [Number],
    },
    public_id: {
        type: String,
        required: true,
        trim: true,
    },
    reference_id: {
        type: Schema.Types.ObjectId,
    },
    type: {
        type: String,
        enum: ['product', 'review'],
        default: 'product',
        required: true,

    }

},
{
    timestamps: true
});

export const Image = mongoose.model("Image", imageSchema);
