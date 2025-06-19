import mongoose from 'mongoose';

const raiBoardInviteSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  inviterName: {
    type: String,
    required: true,
  },
  inviteeEmail: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['editor', 'viewer'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RaiBoardInvite = mongoose.model('RaiBoardInvite', raiBoardInviteSchema);

export default RaiBoardInvite;