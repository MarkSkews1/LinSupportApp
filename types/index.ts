import { Document } from 'mongoose';

// ============================================================================
// ENUMS
// ============================================================================

export enum TicketStatus {
  OPEN = 'open',
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ConversationType {
  CHAT = 'chat',
  EMAIL = 'email',
  PHONE = 'phone',
}

export enum ConversationStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum AgentStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
}

// ============================================================================
// TICKET TYPES
// ============================================================================

export interface ITicket extends Document {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  tags: string[];
  customerId: string;
  customerName: string;
  customerEmail: string;
  assigneeId?: string;
  assigneeName?: string;
  tenantId: string;
  attachments: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export interface ITicketComment extends Document {
  ticketId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  isInternal: boolean;
  attachments: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  createdAt: Date;
}

// ============================================================================
// CONVERSATION TYPES
// ============================================================================

export interface IMessage {
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
}

export interface IConversation extends Document {
  _id: string;
  ticketId?: string;
  type: ConversationType;
  status: ConversationStatus;
  participants: {
    userId: string;
    name: string;
    role: string;
    joinedAt: Date;
  }[];
  messages: IMessage[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// KNOWLEDGE BASE TYPES
// ============================================================================

export interface IArticle extends Document {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId?: string;
  tags: string[];
  status: ArticleStatus;
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdBy: string;
  createdByName: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  parentId?: string;
  order: number;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SLA TYPES
// ============================================================================

export interface ISLA extends Document {
  _id: string;
  name: string;
  description: string;
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  businessHoursOnly: boolean;
  escalationRules: {
    afterMinutes: number;
    escalateTo: string;
    notifyEmails: string[];
  }[];
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface IAgent extends Document {
  _id: string;
  userId: string;
  name: string;
  email: string;
  status: AgentStatus;
  skills: string[];
  maxConcurrentChats: number;
  currentChatCount: number;
  currentTicketCount: number;
  tenantId: string;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateTicketRequest {
  subject: string;
  description: string;
  priority: TicketPriority;
  category?: string;
  tags?: string[];
  customerEmail?: string;
}

export interface UpdateTicketRequest {
  subject?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  tags?: string[];
  assigneeId?: string;
}

export interface TicketListFilter {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  assigneeId?: string;
  customerId?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface TicketMetrics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  averageResolutionTime: number;
  slaCompliance: number;
}

export interface AgentMetrics {
  agentId: string;
  agentName: string;
  ticketsHandled: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
}

