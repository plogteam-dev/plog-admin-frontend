import apiClient from './client';
import type { ApiResponse, DashboardStats } from '@/types';

export const getDashboardStats = async () => {
  const response =
    await apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
  return response.data.data;
};
