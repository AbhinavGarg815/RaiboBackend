import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Assuming you have an Order model
    required: true,
  },
  transactionDetails: {
    type: Object, // Or a more specific schema if the structure is known
    required: true,
    default: {}, // Added default to allow flexibility if details are not immediately available
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  paymentMethod: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Authorize', 'Charge', 'Capture', 'Refund', 'Failed'], // Example statuses
    default: 'Authorize', // Default status
  },
  parentTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Assuming you have a Company model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;