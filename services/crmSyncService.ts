import { getCRMClient, CRMCustomer, CRMInteraction } from './crmApiClient';
import Ticket from '@/models/Ticket';
import Conversation from '@/models/Conversation';
import connectDB from '@/lib/db/mongodb';

export interface CustomerProfile extends CRMCustomer {
  supportTickets?: number;
  activeConversations?: number;
  lastInteraction?: Date;
}

export class CRMSyncService {
  /**
   * Get customer profile with support data
   */
  static async getCustomerProfile(
    customerId: string,
    tenantId: string
  ): Promise<CustomerProfile | null> {
    const crmClient = getCRMClient();

    // Get customer from CRM
    const customer = await crmClient.getCustomer(customerId);
    if (!customer) return null;

    await connectDB();

    // Get support metrics
    const [supportTickets, activeConversations] = await Promise.all([
      Ticket.countDocuments({
        tenantId,
        customerId,
      }),
      Conversation.countDocuments({
        tenantId,
        customerId,
        status: { $in: ['active', 'waiting'] },
      }),
    ]);

    // Get last interaction
    const lastTicket = await Ticket.findOne({ tenantId, customerId })
      .sort({ createdAt: -1 })
      .limit(1);

    return {
      ...customer,
      supportTickets,
      activeConversations,
      lastInteraction: lastTicket?.createdAt,
    };
  }

  /**
   * Search customers by email
   */
  static async searchCustomers(email: string): Promise<CRMCustomer[]> {
    const crmClient = getCRMClient();
    return crmClient.searchCustomersByEmail(email);
  }

  /**
   * Get customer deals
   */
  static async getCustomerDeals(customerId: string) {
    const crmClient = getCRMClient();
    return crmClient.getCustomerDeals(customerId);
  }

  /**
   * Get customer interaction history
   */
  static async getCustomerInteractions(
    customerId: string,
    tenantId: string
  ): Promise<CRMInteraction[]> {
    const crmClient = getCRMClient();

    // Get CRM interactions
    const crmInteractions = await crmClient.getCustomerInteractions(customerId);

    // Optionally add support-specific interactions
    await connectDB();

    const tickets = await Ticket.find({ tenantId, customerId })
      .sort({ createdAt: -1 })
      .limit(10);

    const ticketInteractions: CRMInteraction[] = tickets.map((ticket) => ({
      id: ticket._id.toString(),
      customerId,
      type: 'ticket' as const,
      subject: ticket.title,
      description: ticket.description,
      userId: ticket.createdBy || '',
      userName: ticket.createdByName || 'System',
      createdAt: ticket.createdAt,
    }));

    // Merge and sort by date
    const allInteractions = [...crmInteractions, ...ticketInteractions];
    allInteractions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return allInteractions;
  }

  /**
   * Sync ticket to CRM as interaction
   */
  static async syncTicketToCRM(
    ticketId: string,
    tenantId: string
  ): Promise<boolean> {
    await connectDB();

    const ticket = await Ticket.findOne({ _id: ticketId, tenantId });
    if (!ticket) return false;

    // Only sync if customer ID is available
    if (!ticket.customerId) return false;

    const crmClient = getCRMClient();

    return crmClient.createInteraction({
      customerId: ticket.customerId,
      type: 'ticket',
      subject: ticket.title,
      description: ticket.description,
      userId: ticket.createdBy || '',
      userName: ticket.createdByName || 'System',
    });
  }

  /**
   * Sync conversation to CRM as interaction
   */
  static async syncConversationToCRM(
    conversationId: string,
    tenantId: string
  ): Promise<boolean> {
    await connectDB();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      tenantId,
    });
    if (!conversation) return false;

    // Only sync if customer ID is available
    if (!conversation.customerId) return false;

    const crmClient = getCRMClient();

    return crmClient.createInteraction({
      customerId: conversation.customerId,
      type: 'chat',
      subject: conversation.subject || 'Live Chat Conversation',
      description: `Chat conversation with ${conversation.messages?.length || 0} messages`,
      userId: conversation.assignedAgentId || '',
      userName: conversation.assignedAgentName || 'System',
    });
  }

  /**
   * Check CRM connection status
   */
  static async checkCRMStatus(): Promise<boolean> {
    const crmClient = getCRMClient();
    return crmClient.healthCheck();
  }

  /**
   * Create customer in CRM
   */
  static async createCustomer(customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  }): Promise<CRMCustomer | null> {
    const crmClient = getCRMClient();
    return crmClient.createCustomer(customer);
  }

  /**
   * Update customer in CRM
   */
  static async updateCustomer(
    customerId: string,
    updates: Partial<CRMCustomer>
  ): Promise<boolean> {
    const crmClient = getCRMClient();
    return crmClient.updateCustomer(customerId, updates);
  }
}

