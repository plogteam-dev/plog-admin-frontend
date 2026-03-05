import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSpots, getSpot, updateSpot, deleteSpot, restoreSpot } from '@/api/spots';
import type { SpotListParams, SpotUpdateRequest } from '@/types';

export const useSpots = (params: SpotListParams = {}) => {
  return useQuery({
    queryKey: ['spots', params],
    queryFn: () => getSpots(params),
  });
};

export const useSpot = (id: string) => {
  return useQuery({
    queryKey: ['spots', id],
    queryFn: () => getSpot(id),
    enabled: !!id,
  });
};

export const useUpdateSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SpotUpdateRequest }) =>
      updateSpot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });
};

export const useDeleteSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });
};

export const useRestoreSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });
};
