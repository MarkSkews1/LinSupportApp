'use client';

import { Card } from '@/components/ui/Card';

interface SimpleBarChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  height?: number;
}

export function SimpleBarChart({ title, data, height = 300 }: SimpleBarChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div className="space-y-3" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-700 dark:text-gray-300 truncate">
                {item.label}
              </div>
              <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden relative">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-xs font-medium text-white">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

