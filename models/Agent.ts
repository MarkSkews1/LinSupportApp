import mongoose, { Schema, Model } from 'mongoose';
import { IAgent, AgentStatus } from '@/types';

const AgentSchema = new Schema<IAgent>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AgentStatus),
      default: AgentStatus.OFFLINE,
    },
    skills: {
      type: [String],
      default: [],
    },
    maxConcurrentChats: {
      type: Number,
      default: 5,
    },
    currentChatCount: {
      type: Number,
      default: 0,
    },
    currentTicketCount: {
      type: Number,
      default: 0,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

AgentSchema.index({ tenantId: 1, status: 1 });

const Agent: Model<IAgent> =
  mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);

export default Agent;

