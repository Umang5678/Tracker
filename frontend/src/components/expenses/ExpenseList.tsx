'use client';

import React from 'react';
import { Expense } from '@/types';
import ExpenseCard from './ExpenseCard';
import { Receipt } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  isLoading,
}: ExpenseListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-32 h-4 rounded bg-white/5 animate-pulse" />
              <div className="w-20 h-3 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="w-16 h-5 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          No expenses yet
        </h3>
        <p className="text-sm text-slate-400">
          Start tracking your spending by adding your first expense.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense, index) => (
        <ExpenseCard
          key={expense._id}
          expense={expense}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
}
