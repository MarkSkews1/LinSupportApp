import Ticket from '@/models/Ticket';
import Conversation from '@/models/Conversation';
import Article from '@/models/Article';
import connectDB from '@/lib/db/mongodb';

export interface DashboardMetrics {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    avgResponseTime: number; // in hours
    avgResolutionTime: number; // in hours
  };
  conversations: {
    total: number;
    active: number;
    waiting: number;
    avgResponseTime: number; // in minutes
  };
  articles: {
    total: number;
    published: number;
    totalViews: number;
    avgHelpfulRatio: number; // percentage
  };
}

export interface TicketAnalytics {
  totalTickets: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  responseTimeAvg: number;
  resolutionTimeAvg: number;
  trendData: Array<{ date: string; count: number }>;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  conversationsHandled: number;
  customerSatisfaction?: number;
}

export interface ChatAnalytics {
  totalConversations: number;
  byStatus: Record<string, number>;
  avgMessagesPerConversation: number;
  avgResponseTime: number;
  peakHours: Array<{ hour: number; count: number }>;
}

export interface KBAnalytics {
  totalArticles: number;
  totalViews: number;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    helpfulRatio: number;
  }>;
  byCategory: Record<string, number>;
  searchQueries?: string[];
}

export class AnalyticsService {
  /**
   * Get dashboard overview metrics
   */
  static async getDashboardMetrics(tenantId: string): Promise<DashboardMetrics> {
    await connectDB();

    // Get ticket metrics
    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
    ] = await Promise.all([
      Ticket.countDocuments({ tenantId }),
      Ticket.countDocuments({ tenantId, status: 'open' }),
      Ticket.countDocuments({ tenantId, status: 'in-progress' }),
      Ticket.countDocuments({ tenantId, status: 'resolved' }),
    ]);

    // Get conversation metrics
    const [totalConversations, activeConversations, waitingConversations] =
      await Promise.all([
        Conversation.countDocuments({ tenantId }),
        Conversation.countDocuments({ tenantId, status: 'active' }),
        Conversation.countDocuments({ tenantId, status: 'waiting' }),
      ]);

    // Get article metrics
    const articles = await Article.find({ tenantId });
    const publishedArticles = articles.filter((a) => a.status === 'published');
    const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
    const helpfulTotal = articles.reduce(
      (sum, a) => sum + (a.helpfulCount || 0),
      0
    );
    const notHelpfulTotal = articles.reduce(
      (sum, a) => sum + (a.notHelpfulCount || 0),
      0
    );
    const avgHelpfulRatio =
      helpfulTotal + notHelpfulTotal > 0
        ? (helpfulTotal / (helpfulTotal + notHelpfulTotal)) * 100
        : 0;

    // Calculate average response/resolution times (simplified for now)
    const avgResponseTime = 2.5; // hours (placeholder)
    const avgResolutionTime = 24; // hours (placeholder)
    const avgConvResponseTime = 5; // minutes (placeholder)

    return {
      tickets: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        avgResponseTime,
        avgResolutionTime,
      },
      conversations: {
        total: totalConversations,
        active: activeConversations,
        waiting: waitingConversations,
        avgResponseTime: avgConvResponseTime,
      },
      articles: {
        total: articles.length,
        published: publishedArticles.length,
        totalViews,
        avgHelpfulRatio,
      },
    };
  }

  /**
   * Get detailed ticket analytics
   */
  static async getTicketAnalytics(
    tenantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<TicketAnalytics> {
    await connectDB();

    const query: Record<string, unknown> = { tenantId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt = { ...query.createdAt, $gte: startDate };
      if (endDate) query.createdAt = { ...query.createdAt, $lte: endDate };
    }

    const tickets = await Ticket.find(query);

    // Aggregate by status
    const byStatus: Record<string, number> = {};
    tickets.forEach((ticket) => {
      byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1;
    });

    // Aggregate by priority
    const byPriority: Record<string, number> = {};
    tickets.forEach((ticket) => {
      byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1;
    });

    // Aggregate by category
    const byCategory: Record<string, number> = {};
    tickets.forEach((ticket) => {
      if (ticket.categoryId) {
        byCategory[ticket.categoryId] = (byCategory[ticket.categoryId] || 0) + 1;
      }
    });

    // Generate trend data (last 30 days)
    const trendData = this.generateTrendData(tickets, 30);

    return {
      totalTickets: tickets.length,
      byStatus,
      byPriority,
      byCategory,
      responseTimeAvg: 2.5, // Placeholder
      resolutionTimeAvg: 24, // Placeholder
      trendData,
    };
  }

  /**
   * Get agent performance metrics
   */
  static async getAgentPerformance(
    tenantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<AgentPerformance[]> {
    await connectDB();

    const query: Record<string, unknown> = { tenantId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt = { ...query.createdAt, $gte: startDate };
      if (endDate) query.createdAt = { ...query.createdAt, $lte: endDate };
    }

    const tickets = await Ticket.find(query);
    const conversations = await Conversation.find(query);

    // Group by agent
    const agentMap = new Map<string, AgentPerformance>();

    tickets.forEach((ticket) => {
      if (ticket.assignedAgentId && ticket.assignedAgentName) {
        if (!agentMap.has(ticket.assignedAgentId)) {
          agentMap.set(ticket.assignedAgentId, {
            agentId: ticket.assignedAgentId,
            agentName: ticket.assignedAgentName,
            ticketsAssigned: 0,
            ticketsResolved: 0,
            avgResponseTime: 0,
            avgResolutionTime: 0,
            conversationsHandled: 0,
          });
        }

        const agent = agentMap.get(ticket.assignedAgentId)!;
        agent.ticketsAssigned++;
        if (ticket.status === 'resolved' || ticket.status === 'closed') {
          agent.ticketsResolved++;
        }
      }
    });

    conversations.forEach((conv) => {
      if (conv.assignedAgentId && conv.assignedAgentName) {
        if (!agentMap.has(conv.assignedAgentId)) {
          agentMap.set(conv.assignedAgentId, {
            agentId: conv.assignedAgentId,
            agentName: conv.assignedAgentName,
            ticketsAssigned: 0,
            ticketsResolved: 0,
            avgResponseTime: 0,
            avgResolutionTime: 0,
            conversationsHandled: 0,
          });
        }

        const agent = agentMap.get(conv.assignedAgentId)!;
        agent.conversationsHandled++;
      }
    });

    return Array.from(agentMap.values());
  }

  /**
   * Get chat analytics
   */
  static async getChatAnalytics(
    tenantId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ChatAnalytics> {
    await connectDB();

    const query: Record<string, unknown> = { tenantId };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt = { ...query.createdAt, $gte: startDate };
      if (endDate) query.createdAt = { ...query.createdAt, $lte: endDate };
    }

    const conversations = await Conversation.find(query);

    // By status
    const byStatus: Record<string, number> = {};
    conversations.forEach((conv) => {
      byStatus[conv.status] = (byStatus[conv.status] || 0) + 1;
    });

    // Calculate average messages per conversation
    const totalMessages = conversations.reduce(
      (sum, conv) => sum + (conv.messages?.length || 0),
      0
    );
    const avgMessagesPerConversation =
      conversations.length > 0 ? totalMessages / conversations.length : 0;

    // Peak hours (simplified)
    const peakHours: Array<{ hour: number; count: number }> = [];
    for (let hour = 0; hour < 24; hour++) {
      peakHours.push({ hour, count: Math.floor(Math.random() * 50) });
    }

    return {
      totalConversations: conversations.length,
      byStatus,
      avgMessagesPerConversation,
      avgResponseTime: 5, // minutes (placeholder)
      peakHours,
    };
  }

  /**
   * Get knowledge base analytics
   */
  static async getKBAnalytics(tenantId: string): Promise<KBAnalytics> {
    await connectDB();

    const articles = await Article.find({ tenantId });

    const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);

    // Top articles by views
    const topArticles = articles
      .map((a) => ({
        id: a._id.toString(),
        title: a.title,
        views: a.viewCount || 0,
        helpfulRatio:
          (a.helpfulCount || 0) + (a.notHelpfulCount || 0) > 0
            ? ((a.helpfulCount || 0) /
                ((a.helpfulCount || 0) + (a.notHelpfulCount || 0))) *
              100
            : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // By category
    const byCategory: Record<string, number> = {};
    articles.forEach((article) => {
      if (article.categoryId) {
        byCategory[article.categoryId] = (byCategory[article.categoryId] || 0) + 1;
      }
    });

    return {
      totalArticles: articles.length,
      totalViews,
      topArticles,
      byCategory,
    };
  }

  /**
   * Generate trend data for charts
   */
  private static generateTrendData(
    items: Array<{ createdAt: Date }>,
    days: number
  ): Array<{ date: string; count: number }> {
    const now = new Date();
    const trendMap = new Map<string, number>();

    // Initialize all days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendMap.set(dateStr, 0);
    }

    // Count items per day
    items.forEach((item) => {
      const dateStr = new Date(item.createdAt).toISOString().split('T')[0];
      if (trendMap.has(dateStr)) {
        trendMap.set(dateStr, trendMap.get(dateStr)! + 1);
      }
    });

    return Array.from(trendMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

