import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    viewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },


}, { timestamps: true });

const History = mongoose.model('History', historySchema);

export { History };
