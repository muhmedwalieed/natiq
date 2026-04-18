import mongoose from 'mongoose';
import { CHANNELS, CHAT_STATUS } from '../constants/index.js';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'agent', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: function() { return !this.mediaUrl; },
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio', 'file'],
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    mimeType: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: true }
);

const chatSessionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    channel: {
      type: String,
      enum: Object.values(CHANNELS),
      required: [true, 'Channel is required'],
    },
    messages: [messageSchema],
    status: {
      type: String,
      enum: Object.values(CHAT_STATUS),
      default: CHAT_STATUS.ACTIVE,
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },

        assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isAgentHandling: {
      type: Boolean,
      default: false,
    },
    summary: {
      overview: { type: String, default: null },
      detectedIntent: { type: String, default: null },
      confidence: { type: Number, default: null },
      linkedTicketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        default: null,
      },
      relatedKnowledgeIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'KnowledgeItem',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

chatSessionSchema.index({ companyId: 1, userId: 1, createdAt: -1 });
chatSessionSchema.index({ companyId: 1, status: 1, lastActivity: -1 });
chatSessionSchema.index({ companyId: 1, channel: 1 });

export default mongoose.model('ChatSession', chatSessionSchema);
