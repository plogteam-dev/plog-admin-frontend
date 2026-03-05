import { useQuery } from '@tanstack/react-query';
import { getSuggestions, type SuggestionListParams } from '@/api/suggestions';

export const useSuggestions = (params: SuggestionListParams = {}) => {
  return useQuery({
    queryKey: ['suggestions', params],
    queryFn: () => getSuggestions(params),
  });
};
