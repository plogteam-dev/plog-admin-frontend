import apiClient from './client';
import type { ApiResponse } from '@/types';

// 어드민 댓글 삭제 (soft delete). 사용자용 삭제와 달리 본인 체크 없음.
export const deleteComment = async (id: string) => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/admin/comments/${id}`,
  );
  return response.data.data;
};
