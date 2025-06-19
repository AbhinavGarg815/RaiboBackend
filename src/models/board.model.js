import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  products: [
    {
      product_id: { // Backend product ID reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      position: {
        x: {type: Number},
        y: {type: Number},
      },
      size: {
        width: {type: Number},
        height: {type: Number},
      },
      zIndex: {type: Number, default: 1},
      rotation: {type: Number, default: 0},
    },
  ],
  textElements: [
    {
      type: { type: String, enum: ['heading', 'paragraph'] },
      content: {type : String},
      position: {
        x: {type: Number},
        y: {type: Number},
      },
      size: {
        width: {type: Number},
        height: {type: Number},
      },
      zIndex: {type: Number, default: 1},
      rotation: {type: Number, default: 0},
      fontWeight: { type: String, enum: ['normal', 'bold'] },
      color: String,
    },
  ],
  collaborators: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: ['owner', 'editor', 'viewer'] },
      joinedAt: Date,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  settings: {
    gridSize: Number,
    showGrid: Boolean,
    allowOverlap: Boolean,
    maxZoom: Number,
    minZoom: Number,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});

boardSchema.set('timestamps', true); // Adds createdAt and updatedAt fields

const Board = mongoose.model('Board', boardSchema);

export {Board} ;