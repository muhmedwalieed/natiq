import mongoose from 'mongoose';
import { EVENT_TYPES } from '../constants/index.js';

const eventLogSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    eventType: {
      type: String,
      enum: Object.values(EVENT_TYPES),
      required: [true, 'Event type is required'],
    },
    entityType: {
      type: String,
      enum: ['chat_session', 'ticket', 'user', 'knowledge_item'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      amount: { type: Number, default: null },
      category: { type: String, default: null },
      channel: { type: String, default: null },
      agentId: { type: mongoose.Schema.Types.ObjectId, default: null },
      intent: { type: String, default: null },
      confidence: { type: Number, default: null },
      message: { type: String, default: null },
    },
  },
  {
    timestamps: false,
  }
);

eventLogSchema.index({ companyId: 1, eventType: 1, timestamp: -1 });
eventLogSchema.index({ companyId: 1, timestamp: -1 });
eventLogSchema.index({ companyId: 1, entityType: 1, entityId: 1 });

export default mongoose.model('EventLog', eventLogSchema);
