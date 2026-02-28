'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomerProfile } from '@/components/crm/CustomerProfile';
import { DealsList } from '@/components/crm/DealsList';
import { InteractionTimeline } from '@/components/crm/InteractionTimeline';
import { Loading } from '@/components/ui/Loading';
import Link from 'next/link';

interface CustomerData {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    status: 'lead' | 'prospect' | 'customer' | 'inactive';
    tags?: string[];
    createdAt: Date;
    supportTickets?: number;
    activeConversations?: number;
    lastInteraction?: Date;
  };
  deals: Array<{
    id: string;
    title: string;
    value: number;
    stage: string;
    probability: number;
    expectedCloseDate?: Date;
    status: 'open' | 'won' | 'lost';
    createdAt: Date;
  }>;
  interactions: Array<{
    id: string;
    type: 'email' | 'call' | 'meeting' | 'note' | 'ticket' | 'chat';
    subject: string;
    description?: string;
    userName: string;
    createdAt: Date;
  }>;
}

export default function CustomerPage() {
  const params = useParams();
  const customerId = params?.id as string;

  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [profileRes, dealsRes, interactionsRes] = await Promise.all([
        fetch(`/api/crm/customers/${customerId}`),
        fetch(`/api/crm/customers/${customerId}/deals`),
        fetch(`/api/crm/customers/${customerId}/interactions`),
      ]);

      if (!profileRes.ok) {
        throw new Error('Failed to fetch customer profile');
      }

      const profileData = await profileRes.json();
      const dealsData = dealsRes.ok ? await dealsRes.json() : { deals: [] };
      const interactionsData = interactionsRes.ok
        ? await interactionsRes.json()
        : { interactions: [] };

      setCustomerData({
        profile: profileData.profile,
        deals: dealsData.deals || [],
        interactions: interactionsData.interactions || [],
      });
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to load customer data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading customer..." />
      </div>
    );
  }

  if (error || !customerData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Customer not found'}</p>
          <Link href="/crm">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to CRM
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/crm">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Customer Details
          </h1>
        </div>
      </div>

      {/* Profile */}
      <div className="mb-6">
        <CustomerProfile {...customerData.profile} />
      </div>

      {/* Deals and Interactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DealsList deals={customerData.deals} />
        <InteractionTimeline interactions={customerData.interactions} />
      </div>
    </div>
  );
}

