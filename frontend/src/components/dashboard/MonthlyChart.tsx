'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { MonthlyTrend } from '@/types';
import { getMonthName, formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Filler);

interface MonthlyChartProps {
  data: MonthlyTrend[];
  isLoading: boolean;
}

export default function MonthlyChart({ data, isLoading }: MonthlyChartProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="h-[350px] flex items-center justify-center">
          <div className="flex items-end gap-3 h-40">
            {[40, 70, 55, 85, 60, 90].map((h, i) => (
              <div
                key={i}
                className="w-10 rounded-t-lg bg-white/5 animate-pulse"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          Monthly Trend
        </h3>
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          <p>No expense data yet</p>
        </div>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => getMonthName(d.month)),
    datasets: [
      {
        label: 'Expenses',
        data: data.map((d) => d.total),
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(99, 102, 241, 0.5)';
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.6)');
          return gradient;
        },
        borderColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.6)',
          font: { size: 12 },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(99, 102, 241, 0.06)',
        },
        ticks: {
          color: 'rgba(148, 163, 184, 0.6)',
          font: { size: 12 },
          callback: (value: any) => formatCurrency(value),
        },
        border: {
          display: false,
        },
      },
    },
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
          label: (context: any) => ` ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-6">Monthly Trend</h3>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}
