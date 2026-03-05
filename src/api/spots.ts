import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Spot,
  SpotListParams,
  SpotUpdateRequest,
} from '@/types';

export const getSpots = async (params: SpotListParams = {}) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Spot>>>(
    '/admin/spots',
    { params },
  );
  return response.data.data;
};

export const getSpot = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Spot>>(
    `/admin/spots/${id}`,
  );
  return response.data.data;
};

export const updateSpot = async (id: string, data: SpotUpdateRequest) => {
  const response = await apiClient.patch<ApiResponse<Spot>>(
    `/admin/spots/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteSpot = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/admin/spots/${id}`,
  );
  return response.data.data;
};

export const restoreSpot = async (id: string) => {
  const response = await apiClient.patch<ApiResponse<Spot>>(
    `/admin/spots/${id}/restore`,
  );
  return response.data.data;
};
