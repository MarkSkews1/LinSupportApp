import mongoose, { Schema, Model } from 'mongoose';
import { ITicketComment } from '@/types';

const TicketCommentSchema = new Schema<ITicketComment>(
  {
    ticketId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isInternal: {
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
  {
    timestamps: true,
  }
);

// Index for fetching comments by ticket
TicketCommentSchema.index({ ticketId: 1, createdAt: 1 });

const TicketComment: Model<ITicketComment> =
  mongoose.models.TicketComment ||
  mongoose.model<ITicketComment>('TicketComment', TicketCommentSchema);

export default TicketComment;

