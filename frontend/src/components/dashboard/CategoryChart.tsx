'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryBreakdown } from '@/types';
import { CATEGORY_CONFIG, formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  data: CategoryBreakdown[];
  isLoading: boolean;
}

export default function CategoryChart({ data, isLoading }: CategoryChartProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="h-[350px] flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-white/5 border-t-indigo-500 animate-spin" />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          Category Breakdown
        </h3>
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          <p>No expense data yet</p>
        </div>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map(
          (d) => CATEGORY_CONFIG[d.category]?.color || '#8b5cf6'
        ),
        borderColor: 'rgba(10, 14, 26, 0.8)',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context: any) => ` ${formatCurrency(context.parsed)}`,
        },
      },
    },
  };

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-6">
        Category Breakdown
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Chart */}
        <div className="relative w-56 h-56">
          <Doughnut data={chartData} options={options} />
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-lg font-bold text-white">
              {formatCurrency(total)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-3">
          {data.map((item) => {
            const config = CATEGORY_CONFIG[item.category];
            const percentage = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0';
            return (
              <div
                key={item.category}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config?.color }}
                  />
                  <span className="text-sm text-slate-300">
                    {config?.icon} {item.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-white">
                    {formatCurrency(item.total)}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
