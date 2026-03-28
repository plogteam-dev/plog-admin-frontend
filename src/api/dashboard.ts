import apiClient from './client';
import type {
  ApiResponse,
  DashboardStats,
  DailyStatsParams,
  DailyStatsResponse,
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
