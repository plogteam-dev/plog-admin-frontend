import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Log,
  LogListParams,
  LogUpdateRequest,
} from '@/types';

export const getLogs = async (params: LogListParams = {}) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Log>>>(
    '/admin/logs',
    { params },
  );
  return response.data.data;
};

export const getLog = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Log>>(`/admin/logs/${id}`);
  return response.data.data;
};

export const updateLog = async (id: string, data: LogUpdateRequest) => {
  const response = await apiClient.patch<ApiResponse<Log>>(
    `/admin/logs/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteLog = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/admin/logs/${id}`,
  );
  return response.data.data;
};

export const restoreLog = async (id: string) => {
  const response = await apiClient.patch<ApiResponse<Log>>(
    `/admin/logs/${id}/restore`,
  );
  return response.data.data;
};
