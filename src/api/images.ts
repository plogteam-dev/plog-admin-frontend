import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Image,
  ImageListParams,
} from '@/types';

export const getImages = async (params: ImageListParams = {}) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Image>>>(
    '/admin/images',
    { params },
  );
  return response.data.data;
};

export const getImage = async (id: string) => {
  const response = await apiClient.get<ApiResponse<Image>>(
    `/admin/images/${id}`,
  );
  return response.data.data;
};

export const deleteImage = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/admin/images/${id}`,
  );
  return response.data.data;
};

export const restoreImage = async (id: string) => {
  const response = await apiClient.patch<ApiResponse<Image>>(
    `/admin/images/${id}/restore`,
  );
  return response.data.data;
};
