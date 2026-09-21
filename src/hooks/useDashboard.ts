import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardStats,
  getDashboardDailyStats,
  getAnalytics,
  rebuildAnalytics,
} from '@/api/dashboard';
import type {
  DailyStatsParams,
  AnalyticsParams,
  AnalyticsRebuildParams,
} from '@/types';

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

export const useAnalytics = (params?: AnalyticsParams) => {
  return useQuery({
    queryKey: ['dashboard', 'analytics', params],
    queryFn: () => getAnalytics(params),
  });
};

export const useRebuildAnalytics = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: AnalyticsRebuildParams) => rebuildAnalytics(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'analytics'] });
    },
  });
};
