import apiClient from './client';
import type {
  ApiResponse,
  DashboardStats,
  DailyStatsParams,
  DailyStatsResponse,
  AnalyticsParams,
  AnalyticsResponse,
  AnalyticsRebuildParams,
} from '@/types';

export const getDashboardStats = async () => {
  const response =
    await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
  return response.data.data;
};

export const getDashboardDailyStats = async (params?: DailyStatsParams) => {
  const response = await apiClient.get<ApiResponse<DailyStatsResponse>>(
    '/admin/dashboard/stats/daily',
    { params },
  );
  return response.data.data;
};

export const getAnalytics = async (params?: AnalyticsParams) => {
  const response = await apiClient.get<ApiResponse<AnalyticsResponse>>(
    '/admin/dashboard/analytics',
    { params },
  );
  return response.data.data;
};

export const rebuildAnalytics = async (params?: AnalyticsRebuildParams) => {
  const response = await apiClient.post<ApiResponse<unknown>>(
    '/admin/dashboard/analytics/rebuild',
    null,
    { params },
  );
  return response.data.data;
};
