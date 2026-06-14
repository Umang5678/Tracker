'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import CategoryChart from '@/components/dashboard/CategoryChart';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import { ExpenseStats } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface DashboardPageProps {
  onMenuToggle?: () => void;
}

export default function DashboardPage({ onMenuToggle }: DashboardPageProps) {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/expenses/stats');
      setStats(res.data.data);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        subtitle="Overview of your expenses"
        onMenuToggle={onMenuToggle}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} isLoading={isLoading} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-slide-up opacity-0 stagger-3">
            <CategoryChart
              data={stats?.categoryBreakdown || []}
              isLoading={isLoading}
            />
          </div>
          <div className="animate-slide-up opacity-0 stagger-4">
            <MonthlyChart
              data={stats?.monthlyTrend || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
