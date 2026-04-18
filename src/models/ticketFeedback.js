import mongoose from 'mongoose';
import { CHANNELS } from '../constants/index.js';

const ticketFeedbackSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for AI-only tickets
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: null,
    },
    channel: {
      type: String,
      enum: Object.values(CHANNELS),
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

ticketFeedbackSchema.index({ ticketId: 1, userId: 1 }, { unique: true });

ticketFeedbackSchema.index({ companyId: 1, agentId: 1, submittedAt: -1 });

export default mongoose.model('TicketFeedback', ticketFeedbackSchema);
