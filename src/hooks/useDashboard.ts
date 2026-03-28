import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getDashboardDailyStats } from '@/api/dashboard';
import type { DailyStatsParams } from '@/types';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });
};

export const useDashboardDailyStats = (params?: DailyStatsParams) => {
  return useQuery({
    queryKey: ['dashboard', 'daily-stats', params],
    queryFn: () => getDashboardDailyStats(params),
  });
};
