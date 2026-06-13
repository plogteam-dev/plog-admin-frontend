import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Report,
  ReportListParams,
  ReportUpdateRequest,
} from '@/types';

export const getReports = async (params: ReportListParams = {}) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Report>>>(
    '/admin/reports',
    { params },
  );
  return response.data.data;
};

export const getReport = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Report>>(
    `/admin/reports/${id}`,
  );
  return response.data.data;
};

export const updateReport = async (id: string, data: ReportUpdateRequest) => {
  const response = await apiClient.patch<ApiResponse<Report>>(
    `/admin/reports/${id}`,
    data,
  );
  return response.data.data;
};
