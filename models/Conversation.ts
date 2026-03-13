import mongoose, { Schema, Document, Model } from 'mongoose';
import { ConversationStatus } from '@/types';

export interface IConversation extends Document {
  customerId?: string;
  customerName: string;
  customerEmail: string;
  agentId?: string;
  status: ConversationStatus;
  channel: string;
  messages: Array<{ role: string; content: string; timestamp: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    customerId: String,
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    agentId: String,
    status: { type: String, enum: Object.values(ConversationStatus), default: ConversationStatus.ACTIVE },
    channel: { type: String, default: 'chat' },
    messages: [{ role: String, content: String, timestamp: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> =
  (mongoose.models.Conversation as Model<IConversation>) ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;

