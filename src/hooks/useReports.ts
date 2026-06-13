import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports, getReport, updateReport } from '@/api/reports';
import type { ReportListParams, ReportUpdateRequest } from '@/types';

export const useReports = (params: ReportListParams = {}) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => getReports(params),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => getReport(id),
    enabled: !!id,
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReportUpdateRequest }) =>
      updateReport(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
