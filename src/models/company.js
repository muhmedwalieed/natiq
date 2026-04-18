import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    industry: {
      type: String,
      enum: ['telecom', 'banking', 'ecommerce', 'healthcare', 'other'],
      default: 'telecom',
    },
    channelsConfig: {
      telegram: {
        botToken: { type: String, default: null },
        webhookSecret: { type: String, default: null },
        isActive: { type: Boolean, default: false },
      },
      whatsapp: {
        isActive: { type: Boolean, default: false },
      },
      webChat: {
        isActive: { type: Boolean, default: true },
      },
    },
    settings: {
      aiEnabled: { type: Boolean, default: true },
      escalationThreshold: { type: Number, default: 0.5, min: 0, max: 1 },
      maxSessionMessages: { type: Number, default: 50 },
      workingHours: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' },
        timezone: { type: String, default: 'UTC' },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ isActive: 1 });

export default mongoose.model('Company', companySchema);
