import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImages, getImage, deleteImage, restoreImage } from '@/api/images';
import type { ImageListParams } from '@/types';

export const useImages = (params: ImageListParams = {}) => {
  return useQuery({
    queryKey: ['images', params],
    queryFn: () => getImages(params),
  });
};

export const useImage = (id: string) => {
  return useQuery({
    queryKey: ['images', id],
    queryFn: () => getImage(id),
    enabled: !!id,
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};

export const useRestoreImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};
