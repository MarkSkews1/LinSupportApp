'use client';

import { Card } from '@/components/ui/Card';

interface SimpleLineChartProps {
  title: string;
  data: Array<{ date: string; count: number }>;
  height?: number;
}

export function SimpleLineChart({ title, data, height = 200 }: SimpleLineChartProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
        <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.count), 1);
  const width = 800;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (item.count / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  const polylinePoints = points.join(' ');

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          className="text-gray-700 dark:text-gray-300"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + chartHeight * (1 - ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="currentColor"
                  opacity="0.6"
                >
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            );
          })}

          {/* Line */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="rgb(37, 99, 235)"
            strokeWidth="2"
          />

          {/* Points */}
          {points.map((point, index) => {
            const [x, y] = point.split(',').map(Number);
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="rgb(37, 99, 235)"
                  className="cursor-pointer hover:r-6 transition-all"
                />
                {/* Date labels (show every nth label to avoid crowding) */}
                {index % Math.ceil(data.length / 8) === 0 && (
                  <text
                    x={x}
                    y={height - padding / 2}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    opacity="0.6"
                  >
                    {new Date(data[index].date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

