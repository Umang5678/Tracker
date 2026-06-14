// User types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Expense types
export type ExpenseCategory = 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  _id: string;
  user: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number | string;
  category: ExpenseCategory;
  date: string;
  description?: string;
}

// Stats types
export interface CategoryBreakdown {
  category: ExpenseCategory;
  total: number;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
}

export interface ExpenseStats {
  totalExpenses: number;
  monthlyExpenses: number;
  expenseCount: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyTrend[];
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: { field: string; message: string }[];
}
