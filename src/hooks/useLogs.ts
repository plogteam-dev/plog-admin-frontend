import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLogs, getLog, updateLog, deleteLog, restoreLog } from '@/api/logs';
import type { LogListParams, LogUpdateRequest } from '@/types';

export const useLogs = (params: LogListParams = {}) => {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: () => getLogs(params),
  });
};

export const useLog = (id: string) => {
  return useQuery({
    queryKey: ['logs', id],
    queryFn: () => getLog(id),
    enabled: !!id,
  });
};

export const useUpdateLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LogUpdateRequest }) =>
      updateLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
};

export const useDeleteLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
};

export const useRestoreLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
};
