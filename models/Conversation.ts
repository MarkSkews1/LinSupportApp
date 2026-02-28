import mongoose, { Schema, Model } from 'mongoose';
import { IConversation, ConversationType, ConversationStatus } from '@/types';

const ConversationSchema = new Schema<IConversation>(
  {
    ticketId: {
      type: String,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(ConversationType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ConversationStatus),
      default: ConversationStatus.ACTIVE,
    },
    participants: [
      {
        userId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    messages: [
      {
        senderId: {
          type: String,
          required: true,
        },
        senderName: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
        attachments: [
          {
            name: String,
            url: String,
            size: Number,
            type: String,
          },
        ],
      },
    ],
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
ConversationSchema.index({ tenantId: 1, status: 1 });
ConversationSchema.index({ 'participants.userId': 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;

