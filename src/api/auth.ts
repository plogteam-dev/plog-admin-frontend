import apiClient from './client';
import type { ApiResponse, LoginRequest, LoginResponse } from '@/types';

export const login = async (data: LoginRequest) => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/admin/auth/login',
    data,
  );
  return response.data.data;
};
