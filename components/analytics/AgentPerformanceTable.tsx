'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AgentPerformance {
  agentId: string;
  agentName: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  conversationsHandled: number;
}

interface AgentPerformanceTableProps {
  performance: AgentPerformance[];
}

export function AgentPerformanceTable({ performance }: AgentPerformanceTableProps) {
  if (performance.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Agent Performance
        </h3>
        <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          No agent data available
        </div>
      </Card>
    );
  }

  const calculateResolutionRate = (resolved: number, assigned: number) => {
    return assigned > 0 ? Math.round((resolved / assigned) * 100) : 0;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Agent Performance
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Agent
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tickets Assigned
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tickets Resolved
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolution Rate
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Conversations
              </th>
            </tr>
          </thead>
          <tbody>
            {performance.map((agent) => {
              const resolutionRate = calculateResolutionRate(
                agent.ticketsResolved,
                agent.ticketsAssigned
              );
              return (
                <tr
                  key={agent.agentId}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {agent.agentName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    {agent.ticketsAssigned}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    {agent.ticketsResolved}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge
                      variant={
                        resolutionRate >= 80
                          ? 'success'
                          : resolutionRate >= 60
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {resolutionRate}%
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    {agent.conversationsHandled}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

