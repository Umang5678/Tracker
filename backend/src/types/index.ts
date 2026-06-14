import { Request } from 'express';

// User interfaces
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPayload {
  id: string;
  email: string;
}

// Expense interfaces
export type ExpenseCategory = 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Other';

export interface IExpense {
  _id: string;
  user: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended Request with user
export interface AuthRequest extends Request {
  user?: IUserPayload;
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

// Stats
export interface ExpenseStats {
  totalExpenses: number;
  monthlyExpenses: number;
  categoryBreakdown: {
    category: ExpenseCategory;
    total: number;
    count: number;
  }[];
  monthlyTrend: {
    month: string;
    total: number;
  }[];
}
