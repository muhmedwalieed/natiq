import mongoose from 'mongoose';
import { KNOWLEDGE_TYPE } from '../constants/index.js';

const knowledgeItemSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(KNOWLEDGE_TYPE),
      required: [true, 'Knowledge type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

        embeddingVector: {
      type: [Number],
      default: [],
    },
    embeddingModel: {
      type: String,
      default: null,
    },
    lastEmbeddedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

knowledgeItemSchema.index({ companyId: 1, slug: 1 }, { unique: true });
knowledgeItemSchema.index({ companyId: 1, isActive: 1 });
knowledgeItemSchema.index({ companyId: 1, type: 1 });

export default mongoose.model('KnowledgeItem', knowledgeItemSchema);
