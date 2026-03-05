import apiClient from './client';
import type { ApiResponse, PaginatedResponse } from '@/types';

export interface Suggestion {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: string;
    nickname: string;
    email: string;
  };
}

export interface SuggestionListParams {
  page?: number;
  limit?: number;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const getSuggestions = async (params: SuggestionListParams = {}) => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Suggestion>>>(
    '/admin/suggestions',
    { params },
  );
  return response.data.data;
};
