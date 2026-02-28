'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar } from 'lucide-react';
import { SimpleBarChart } from '@/components/analytics/SimpleBarChart';
import { SimpleLineChart } from '@/components/analytics/SimpleLineChart';
import { AgentPerformanceTable } from '@/components/analytics/AgentPerformanceTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Loading } from '@/components/ui/Loading';

interface AgentPerformance {
  agentId: string;
  agentName: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  conversationsHandled: number;
}

interface ChatAnalytics {
  totalConversations: number;
  byStatus: Record<string, number>;
  avgMessagesPerConversation: number;
  avgResponseTime: number;
}

interface KBAnalytics {
  totalArticles: number;
  totalViews: number;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    helpfulRatio: number;
  }>;
}

export default function ReportsPage() {
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [chatAnalytics, setChatAnalytics] = useState<ChatAnalytics | null>(null);
  const [kbAnalytics, setKBAnalytics] = useState<KBAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(timeRange));

      const [agentsRes, chatRes, kbRes] = await Promise.all([
        fetch(
          `/api/analytics/agents?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        ),
        fetch(
          `/api/analytics/chat?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        ),
        fetch('/api/analytics/kb'),
      ]);

      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgentPerformance(data.performance || []);
      }

      if (chatRes.ok) {
        const data = await chatRes.json();
        setChatAnalytics(data.analytics);
      }

      if (kbRes.ok) {
        const data = await kbRes.json();
        setKBAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Export functionality coming soon!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading reports..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Reports & Analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed insights and performance metrics
            </p>
          </div>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Time Range Filter */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Range:
            </label>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-48"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Agent Performance */}
      <div className="mb-6">
        <AgentPerformanceTable performance={agentPerformance} />
      </div>

      {/* Chat Analytics */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <SimpleBarChart
          title="Conversations by Status"
          data={
            Object.entries(chatAnalytics?.byStatus || {}).map(
              ([label, value]) => ({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                value,
              })
            ) || []
          }
        />
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Chat Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Conversations
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {chatAnalytics?.totalConversations || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Avg Messages per Conversation
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {chatAnalytics?.avgMessagesPerConversation.toFixed(1) || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Avg Response Time
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {chatAnalytics?.avgResponseTime || 0} min
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Knowledge Base Analytics */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            KB Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Articles
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {kbAnalytics?.totalArticles || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Views
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {kbAnalytics?.totalViews || 0}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top Articles
          </h3>
          <div className="space-y-3">
            {kbAnalytics?.topArticles.slice(0, 5).map((article, index) => (
              <div
                key={article.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {index + 1}. {article.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {article.helpfulRatio.toFixed(0)}% helpful
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-4">
                  {article.views} views
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

