import mongoose from 'mongoose';

const callSchema = new mongoose.Schema(
  {
    callId: {
      type: String,
      required: true,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      default: 'Customer',
    },
    agentName: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['ringing', 'active', 'ended', 'missed', 'rejected'],
      default: 'ringing',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // seconds
      default: 0,
    },
    channel: {
      type: String,
      default: 'voice',
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      default: null,
    },
    endedBy: {
      type: String, // 'agent' | 'customer'
      default: null,
    },
    recordingUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

callSchema.index({ companyId: 1, createdAt: -1 });
callSchema.index({ companyId: 1, agentId: 1, createdAt: -1 });
callSchema.index({ companyId: 1, customerId: 1 });

export default mongoose.model('Call', callSchema);
