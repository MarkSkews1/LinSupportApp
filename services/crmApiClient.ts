/**
 * LinCRM API Client
 * Handles communication with LinCRM application
 */

export interface CRMCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMDeal {
  id: string;
  title: string;
  customerId: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: Date;
  status: 'open' | 'won' | 'lost';
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMInteraction {
  id: string;
  customerId: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'ticket' | 'chat';
  subject: string;
  description?: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors?: string[];
}

export class CRMApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.LINCRM_API_URL || 'http://localhost:3002/api';
    this.apiKey = process.env.LINCRM_API_KEY || '';
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId: string): Promise<CRMCustomer | null> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }

      const data = await response.json();
      return data.customer;
    } catch (error) {
      console.error('Error fetching customer from CRM:', error);
      return null;
    }
  }

  /**
   * Search customers by email
   */
  async searchCustomersByEmail(email: string): Promise<CRMCustomer[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/customers/search?email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search customers: ${response.statusText}`);
      }

      const data = await response.json();
      return data.customers || [];
    } catch (error) {
      console.error('Error searching customers in CRM:', error);
      return [];
    }
  }

  /**
   * Get customer deals
   */
  async getCustomerDeals(customerId: string): Promise<CRMDeal[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/customers/${customerId}/deals`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.statusText}`);
      }

      const data = await response.json();
      return data.deals || [];
    } catch (error) {
      console.error('Error fetching customer deals:', error);
      return [];
    }
  }

  /**
   * Get customer interactions
   */
  async getCustomerInteractions(customerId: string): Promise<CRMInteraction[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/customers/${customerId}/interactions`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch interactions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.interactions || [];
    } catch (error) {
      console.error('Error fetching customer interactions:', error);
      return [];
    }
  }

  /**
   * Create interaction in CRM (sync ticket/chat to CRM)
   */
  async createInteraction(interaction: {
    customerId: string;
    type: CRMInteraction['type'];
    subject: string;
    description?: string;
    userId: string;
    userName: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/interactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interaction),
      });

      if (!response.ok) {
        throw new Error(`Failed to create interaction: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error creating interaction in CRM:', error);
      return false;
    }
  }

  /**
   * Update customer in CRM
   */
  async updateCustomer(
    customerId: string,
    updates: Partial<CRMCustomer>
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating customer in CRM:', error);
      return false;
    }
  }

  /**
   * Create customer in CRM
   */
  async createCustomer(customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  }): Promise<CRMCustomer | null> {
    try {
      const response = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        throw new Error(`Failed to create customer: ${response.statusText}`);
      }

      const data = await response.json();
      return data.customer;
    } catch (error) {
      console.error('Error creating customer in CRM:', error);
      return null;
    }
  }

  /**
   * Check if CRM is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('CRM health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
let crmClient: CRMApiClient | null = null;

export function getCRMClient(): CRMApiClient {
  if (!crmClient) {
    crmClient = new CRMApiClient();
  }
  return crmClient;
}

