import Conversation from '@/models/Conversation';
import Ticket from '@/models/Ticket';
import connectDB from '@/lib/db/mongodb';
import { emitToConversation, emitToUser } from '@/lib/socket/server';

export interface CreateConversationParams {
  tenantId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject?: string;
  ticketId?: string;
}

export interface SendMessageParams {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'agent' | 'manager' | 'admin';
  content: string;
  tenantId: string;
}

export interface AssignConversationParams {
  conversationId: string;
  agentId: string;
  agentName: string;
  tenantId: string;
}

export class ChatService {
  /**
   * Create a new conversation
   */
  static async createConversation(params: CreateConversationParams) {
    await connectDB();

    const conversation = await Conversation.create({
      tenantId: params.tenantId,
      customerId: params.customerId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      subject: params.subject || 'New Conversation',
      status: 'active',
      messages: [],
      ticketId: params.ticketId,
    });

    return conversation;
  }

  /**
   * Send a message in a conversation
   */
  static async sendMessage(params: SendMessageParams) {
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: params.conversationId,
      tenantId: params.tenantId,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Add message to conversation
    const message = {
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole,
      content: params.content,
      timestamp: new Date(),
      read: false,
    };

    conversation.messages.push(message);
    conversation.lastMessageAt = new Date();
    conversation.lastMessage = params.content;

    await conversation.save();

    // Emit message to all participants in the conversation
    emitToConversation(params.conversationId, 'message:new', {
      conversationId: params.conversationId,
      message,
    });

    // If there's an assigned agent and the sender is not the agent, notify them
    if (conversation.assignedAgentId && conversation.assignedAgentId !== params.senderId) {
      emitToUser(conversation.assignedAgentId, 'message:notification', {
        conversationId: params.conversationId,
        message,
        customerName: conversation.customerName,
      });
    }

    // If sender is an agent and customer is online, mark as delivered
    if (params.senderRole !== 'customer') {
      emitToUser(conversation.customerId, 'message:new', {
        conversationId: params.conversationId,
        message,
      });
    }

    return { conversation, message };
  }

  /**
   * Assign a conversation to an agent
   */
  static async assignConversation(params: AssignConversationParams) {
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: params.conversationId,
      tenantId: params.tenantId,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.assignedAgentId = params.agentId;
    conversation.assignedAgentName = params.agentName;
    conversation.status = 'active';

    await conversation.save();

    // Notify the assigned agent
    emitToUser(params.agentId, 'conversation:assigned', {
      conversationId: params.conversationId,
      customerName: conversation.customerName,
      subject: conversation.subject,
    });

    // Notify participants in the conversation
    emitToConversation(params.conversationId, 'conversation:assigned', {
      agentId: params.agentId,
      agentName: params.agentName,
    });

    return conversation;
  }

  /**
   * Mark messages as read
   */
  static async markAsRead(conversationId: string, userId: string, tenantId: string) {
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      tenantId,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Mark all messages not sent by the user as read
    let updated = false;
    conversation.messages.forEach((message: { senderId: string; read: boolean }) => {
      if (message.senderId !== userId && !message.read) {
        message.read = true;
        updated = true;
      }
    });

    if (updated) {
      await conversation.save();

      // Notify other participants that messages were read
      emitToConversation(conversationId, 'messages:read', {
        conversationId,
        userId,
      });
    }

    return conversation;
  }

  /**
   * Get conversation by ID
   */
  static async getConversation(conversationId: string, tenantId: string) {
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      tenantId,
    });

    return conversation;
  }

  /**
   * Get all conversations for a tenant
   */
  static async getConversations(tenantId: string, filters?: {
    status?: string;
    agentId?: string;
    customerId?: string;
  }) {
    await connectDB();

    const query: Record<string, string> = { tenantId };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.agentId) {
      query.assignedAgentId = filters.agentId;
    }

    if (filters?.customerId) {
      query.customerId = filters.customerId;
    }

    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .limit(100);

    return conversations;
  }

  /**
   * Close a conversation
   */
  static async closeConversation(conversationId: string, tenantId: string) {
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      tenantId,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.status = 'closed';
    await conversation.save();

    // If there's a linked ticket, update it
    if (conversation.ticketId) {
      await Ticket.findByIdAndUpdate(conversation.ticketId, {
        status: 'resolved',
      });
    }

    // Notify participants
    emitToConversation(conversationId, 'conversation:closed', {
      conversationId,
    });

    return conversation;
  }

  /**
   * Reopen a conversation
   */
  static async reopenConversation(conversationId: string, tenantId: string) {
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      tenantId,
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.status = 'active';
    await conversation.save();

    // If there's a linked ticket, update it
    if (conversation.ticketId) {
      await Ticket.findByIdAndUpdate(conversation.ticketId, {
        status: 'open',
      });
    }

    // Notify participants
    emitToConversation(conversationId, 'conversation:reopened', {
      conversationId,
    });

    return conversation;
  }
}




