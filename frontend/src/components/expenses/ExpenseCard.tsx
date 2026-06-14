'use client';

import React from 'react';
import { Expense } from '@/types';
import { formatCurrency, formatDate, CATEGORY_CONFIG } from '@/lib/utils';
import { Edit3, Trash2 } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  index: number;
}

export default function ExpenseCard({
  expense,
  onEdit,
  onDelete,
  index,
}: ExpenseCardProps) {
  const config = CATEGORY_CONFIG[expense.category];

  return (
    <div
      className={`glass-card p-4 flex items-center gap-4 animate-slide-up opacity-0`}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      {/* Category Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: config?.bg }}
      >
        {config?.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">
          {expense.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: config?.bg,
              color: config?.color,
            }}
          >
            {expense.category}
          </span>
          <span className="text-[11px] text-slate-500">
            {formatDate(expense.date)}
          </span>
        </div>
        {expense.description && (
          <p className="text-xs text-slate-500 mt-1 truncate">
            {expense.description}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-white">
          {formatCurrency(expense.amount)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(expense)}
          className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all cursor-pointer border-0 bg-transparent"
          title="Edit expense"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer border-0 bg-transparent"
          title="Delete expense"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
