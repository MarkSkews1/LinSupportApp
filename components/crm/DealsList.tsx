'use client';

import { formatDistanceToNow } from 'date-fns';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate?: Date;
  status: 'open' | 'won' | 'lost';
  createdAt: Date;
}

interface DealsListProps {
  deals: Deal[];
}

export function DealsList({ deals }: DealsListProps) {
  if (deals.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Deals
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
          No deals found
        </div>
      </Card>
    );
  }

  const getStatusBadge = (status: Deal['status']) => {
    switch (status) {
      case 'won':
        return <Badge variant="success">Won</Badge>;
      case 'lost':
        return <Badge variant="outline">Lost</Badge>;
      case 'open':
        return <Badge variant="default">Open</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Deals ({deals.length})
      </h3>
      <div className="space-y-3">
        {deals.map((deal) => {
          const createdDate =
            deal.createdAt instanceof Date ? deal.createdAt : new Date(deal.createdAt);
          const closeDate = deal.expectedCloseDate
            ? deal.expectedCloseDate instanceof Date
              ? deal.expectedCloseDate
              : new Date(deal.expectedCloseDate)
            : null;

          return (
            <div
              key={deal.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {deal.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {deal.stage}
                  </p>
                </div>
                {getStatusBadge(deal.status)}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">{formatCurrency(deal.value)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{deal.probability}%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {closeDate
                    ? `Closes ${formatDistanceToNow(closeDate, { addSuffix: true })}`
                    : `Created ${formatDistanceToNow(createdDate, { addSuffix: true })}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

