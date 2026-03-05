import { useSearchParams as useRouterSearchParams } from 'react-router';
import { useCallback } from 'react';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useRouterSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key) || undefined,
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const val = searchParams.get(key);
      return val ? Number(val) : fallback;
    },
    [searchParams],
  );

  const set = useCallback(
    (updates: Record<string, string | undefined>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === undefined || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  return { get, getNumber, set };
}
