'use client';

import { useEffect, useState } from 'react';
import { Ticket, MessageSquare, BookOpen, Clock } from 'lucide-react';
import { MetricCard } from '@/components/analytics/MetricCard';
import { SimpleBarChart } from '@/components/analytics/SimpleBarChart';
import { SimpleLineChart } from '@/components/analytics/SimpleLineChart';
import { Loading } from '@/components/ui/Loading';

interface DashboardMetrics {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    avgResponseTime: number;
    avgResolutionTime: number;
  };
  conversations: {
    total: number;
    active: number;
    waiting: number;
    avgResponseTime: number;
  };
  articles: {
    total: number;
    published: number;
    totalViews: number;
    avgHelpfulRatio: number;
  };
}

interface TicketAnalytics {
  totalTickets: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  trendData: Array<{ date: string; count: number }>;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [ticketAnalytics, setTicketAnalytics] = useState<TicketAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [metricsRes, analyticsRes] = await Promise.all([
        fetch('/api/analytics/dashboard'),
        fetch('/api/analytics/tickets'),
      ]);

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data.metrics);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setTicketAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Overview of your support metrics and performance
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <MetricCard
          title="Open Tickets"
          value={metrics?.tickets.open || 0}
          subtitle={`${metrics?.tickets.total || 0} total tickets`}
          icon={Ticket}
        />
        <MetricCard
          title="Active Chats"
          value={metrics?.conversations.active || 0}
          subtitle={`${metrics?.conversations.total || 0} total conversations`}
          icon={MessageSquare}
        />
        <MetricCard
          title="Published Articles"
          value={metrics?.articles.published || 0}
          subtitle={`${metrics?.articles.totalViews || 0} total views`}
          icon={BookOpen}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${metrics?.tickets.avgResponseTime.toFixed(1) || 0}h`}
          subtitle="Ticket response time"
          icon={Clock}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <SimpleLineChart
          title="Ticket Trend (Last 30 Days)"
          data={ticketAnalytics?.trendData || []}
        />
        <SimpleBarChart
          title="Tickets by Status"
          data={
            Object.entries(ticketAnalytics?.byStatus || {}).map(
              ([label, value]) => ({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                value,
              })
            ) || []
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <SimpleBarChart
          title="Tickets by Priority"
          data={
            Object.entries(ticketAnalytics?.byPriority || {}).map(
              ([label, value]) => ({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                value,
              })
            ) || []
          }
        />
      </div>
    </div>
  );
}

