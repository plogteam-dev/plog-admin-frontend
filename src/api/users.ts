import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  UserListParams,
  UserUpdateRequest,
} from '@/types';

export const getUsers = async (params: UserListParams = {}) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
    '/admin/users',
    { params },
  );
  return response.data.data;
};

export const getUser = async (id: string) => {
  const response = await apiClient.get<ApiResponse<User>>(
    `/admin/users/${id}`,
  );
  return response.data.data;
};

export const updateUser = async (id: string, data: UserUpdateRequest) => {
  const response = await apiClient.patch<ApiResponse<User>>(
    `/admin/users/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/admin/users/${id}`,
  );
  return response.data.data;
};

export const restoreUser = async (id: string) => {
  const response = await apiClient.patch<ApiResponse<User>>(
    `/admin/users/${id}/restore`,
  );
  return response.data.data;
};
