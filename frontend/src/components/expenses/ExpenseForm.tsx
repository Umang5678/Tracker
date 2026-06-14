'use client';

import React, { useState, useEffect } from 'react';
import { ExpenseFormData, ExpenseCategory, Expense } from '@/types';
import { CATEGORIES, getTodayISO } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Save, Plus } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  initialData?: Expense | null;
  isSubmitting?: boolean;
}

export default function ExpenseForm({
  onSubmit,
  initialData,
  isSubmitting = false,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    amount: '',
    category: 'Food',
    date: getTodayISO(),
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        date: new Date(initialData.date).toISOString().split('T')[0],
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    }

    const amount = Number(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="expense-title"
        label="Title"
        placeholder="e.g., Lunch at cafe"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        error={errors.title}
      />

      <Input
        id="expense-amount"
        label="Amount (₹)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, amount: e.target.value }))
        }
        error={errors.amount}
      />

      {/* Category Select */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="expense-category"
          className="text-sm font-medium text-slate-300 ml-1"
        >
          Category
        </label>
        <select
          id="expense-category"
          className="input-field appearance-none cursor-pointer"
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              category: e.target.value as ExpenseCategory,
            }))
          }
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-slate-900">
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-xs text-red-400 ml-1">{errors.category}</span>
        )}
      </div>

      <Input
        id="expense-date"
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, date: e.target.value }))
        }
        error={errors.date}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="expense-description"
          className="text-sm font-medium text-slate-300 ml-1"
        >
          Description (optional)
        </label>
        <textarea
          id="expense-description"
          className="input-field resize-none h-20"
          placeholder="Add a note..."
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          maxLength={500}
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        icon={initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        className="w-full mt-2"
      >
        {initialData ? 'Update Expense' : 'Add Expense'}
      </Button>
    </form>
  );
}
