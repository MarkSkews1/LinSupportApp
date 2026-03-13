import mongoose, { Schema, Document, Model } from 'mongoose';
import { TicketStatus, TicketPriority } from '@/types';

export interface ITicket extends Document {
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  assignedToId?: string;
  assignedToName?: string;
  categoryId?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.OPEN },
    priority: { type: String, enum: Object.values(TicketPriority), default: TicketPriority.MEDIUM },
    customerId: String,
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    assignedToId: String,
    assignedToName: String,
    categoryId: String,
    tags: [String],
  },
  { timestamps: true }
);

const Ticket: Model<ITicket> =
  (mongoose.models.Ticket as Model<ITicket>) || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;

