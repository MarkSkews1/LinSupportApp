import mongoose, { Schema, Model } from 'mongoose';
import { ITicket, TicketStatus, TicketPriority } from '@/types';

const TicketSchema = new Schema<ITicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
      index: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    assigneeId: {
      type: String,
      index: true,
    },
    assigneeName: {
      type: String,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
        type: String,
      },
    ],
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate ticket number before saving
TicketSchema.pre('save', async function (next) {
  if (this.isNew && !this.ticketNumber) {
    const count = await mongoose.model<ITicket>('Ticket').countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update resolved/closed dates based on status
TicketSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === TicketStatus.RESOLVED && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    if (this.status === TicketStatus.CLOSED && !this.closedAt) {
      this.closedAt = new Date();
    }
  }
  next();
});

// Indexes for performance
TicketSchema.index({ tenantId: 1, status: 1 });
TicketSchema.index({ tenantId: 1, assigneeId: 1 });
TicketSchema.index({ tenantId: 1, customerId: 1 });
TicketSchema.index({ createdAt: -1 });

const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;

