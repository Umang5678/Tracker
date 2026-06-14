'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Expense, ExpenseFormData, ExpenseCategory } from '@/types';
import { CATEGORIES } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Filter } from 'lucide-react';

interface ExpensesPageProps {
  onMenuToggle?: () => void;
}

export default function ExpensesPage({ onMenuToggle }: ExpensesPageProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      const res = await api.get('/api/expenses', { params });
      setExpenses(res.data.data);
    } catch (error: any) {
      toast.error('Failed to load expenses');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAdd = async (data: ExpenseFormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/api/expenses', data);
      toast.success('Expense added!');
      setShowAddModal(false);
      fetchExpenses();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to add expense';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    try {
      setIsSubmitting(true);
      await api.put(`/api/expenses/${editingExpense._id}`, data);
      toast.success('Expense updated!');
      setEditingExpense(null);
      fetchExpenses();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to update expense';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/api/expenses/${id}`);
      toast.success('Expense deleted!');
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (error: any) {
      const msg =
        error.response?.data?.message || 'Failed to delete expense';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Expenses"
        subtitle={`${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`}
        onMenuToggle={onMenuToggle}
      />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-4 h-4" />}
            size="sm"
          >
            Add Expense
          </Button>
        </div>

        {/* Expense List */}
        <ExpenseList
          expenses={expenses}
          onEdit={(expense) => setEditingExpense(expense)}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Expense"
      >
        <ExpenseForm onSubmit={handleAdd} isSubmitting={isSubmitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        <ExpenseForm
          onSubmit={handleEdit}
          initialData={editingExpense}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
