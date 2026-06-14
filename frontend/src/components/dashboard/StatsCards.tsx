'use client';

import React from 'react';
import { DollarSign, TrendingUp, Receipt, PieChart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ExpenseStats } from '@/types';

interface StatsCardsProps {
  stats: ExpenseStats | null;
  isLoading: boolean;
}

const statCards = [
  {
    key: 'totalExpenses',
    label: 'Total Expenses',
    icon: DollarSign,
    gradient: 'from-indigo-500 to-purple-600',
    format: 'currency',
  },
  {
    key: 'monthlyExpenses',
    label: 'This Month',
    icon: TrendingUp,
    gradient: 'from-cyan-500 to-blue-600',
    format: 'currency',
  },
  {
    key: 'expenseCount',
    label: 'Transactions',
    icon: Receipt,
    gradient: 'from-emerald-500 to-teal-600',
    format: 'number',
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: PieChart,
    gradient: 'from-pink-500 to-rose-600',
    format: 'count',
  },
] as const;

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const getValue = (key: string): string => {
    if (!stats) return '—';
    switch (key) {
      case 'totalExpenses':
        return formatCurrency(stats.totalExpenses);
      case 'monthlyExpenses':
        return formatCurrency(stats.monthlyExpenses);
      case 'expenseCount':
        return stats.expenseCount.toString();
      case 'categories':
        return stats.categoryBreakdown.length.toString();
      default:
        return '—';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <div
          key={card.key}
          className={`glass-card p-5 animate-slide-up opacity-0 stagger-${
            index + 1
          }`}
        >
          {isLoading ? (
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-20 h-4 rounded bg-white/5 animate-pulse" />
              <div className="w-28 h-7 rounded bg-white/5 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                >
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">
                {getValue(card.key)}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
