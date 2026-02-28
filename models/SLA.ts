import mongoose, { Schema, Model } from 'mongoose';
import { ISLA, TicketPriority } from '@/types';

const SLASchema = new Schema<ISLA>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      required: true,
    },
    responseTimeMinutes: {
      type: Number,
      required: true,
    },
    resolutionTimeMinutes: {
      type: Number,
      required: true,
    },
    businessHoursOnly: {
      type: Boolean,
      default: false,
    },
    escalationRules: [
      {
        afterMinutes: Number,
        escalateTo: String,
        notifyEmails: [String],
      },
    ],
    tenantId: {
      type: String,
      required: true,
      index: true,
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

SLASchema.index({ tenantId: 1, priority: 1, isActive: 1 });

const SLA: Model<ISLA> =
  mongoose.models.SLA || mongoose.model<ISLA>('SLA', SLASchema);

export default SLA;

