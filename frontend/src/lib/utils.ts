import { ExpenseCategory } from '@/types';

export const CATEGORIES: ExpenseCategory[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Other'];

export const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  { color: string; bg: string; icon: string; gradient: string }
> = {
  Food: {
    color: '#f97316',
    bg: 'rgba(249,115,22,0.15)',
    icon: '🍕',
    gradient: 'from-orange-500 to-amber-500',
  },
  Travel: {
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
    icon: '✈️',
    gradient: 'from-blue-500 to-cyan-500',
  },
  Shopping: {
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.15)',
    icon: '🛍️',
    gradient: 'from-pink-500 to-rose-500',
  },
  Bills: {
    color: '#eab308',
    bg: 'rgba(234,179,8,0.15)',
    icon: '📄',
    gradient: 'from-yellow-500 to-orange-400',
  },
  Other: {
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.15)',
    icon: '📦',
    gradient: 'from-violet-500 to-purple-500',
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getMonthName(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
