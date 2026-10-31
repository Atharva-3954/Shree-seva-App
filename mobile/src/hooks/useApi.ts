import {useState, useCallback, useRef} from 'react';
import {AxiosError} from 'axios';
import {ApiError} from '../types/common.types';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  errors: Array<{field: string; message: string}> | null;
}

interface UseApiReturn<T, P extends unknown[]> extends UseApiState<T> {
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * Custom hook for making API calls with loading, error, and data states.
 *
 * @param apiFunction - The async API function to call
 * @returns Object with data, isLoading, error, and execute function
 *
 * @example
 * ```tsx
 * const { data: products, isLoading, error, execute } = useApi(productsApi.getProducts);
 *
 * useEffect(() => {
 *   execute({ page: 1, limit: 20 });
 * }, []);
 * ```
 */
export function useApi<T, P extends unknown[]>(
  apiFunction: (...args: P) => Promise<T>,
): UseApiReturn<T, P> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
    errors: null,
  });

  const isMountedRef = useRef(true);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setState(prev => ({...prev, isLoading: true, error: null, errors: null}));

      try {
        const result = await apiFunction(...args);
        if (isMountedRef.current) {
          setState({data: result, isLoading: false, error: null, errors: null});
        }
        return result;
      } catch (err) {
        if (isMountedRef.current) {
          const axiosError = err as AxiosError<ApiError>;
          const errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            'An unexpected error occurred';
          const fieldErrors = axiosError.response?.data?.errors || null;

          setState({
            data: null,
            isLoading: false,
            error: errorMessage,
            errors: fieldErrors,
          });
        }
        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setState({data: null, isLoading: false, error: null, errors: null});
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({...prev, data}));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

/**
 * Custom hook for making API calls that run on mount.
 * Combines useApi with automatic execution on mount.
 *
 * @param apiFunction - The async API function to call
 * @param args - Arguments to pass to the API function
 * @returns Object with data, isLoading, error, and refetch function
 */
export function useApiOnMount<T, P extends unknown[]>(
  apiFunction: (...args: P) => Promise<T>,
  ...args: P
): UseApiReturn<T, P> & {refetch: () => Promise<T | null>} {
  const api = useApi(apiFunction);

  const refetch = useCallback(async () => {
    return api.execute(...args);
  }, [api, ...args]);

  return {
    ...api,
    refetch,
  };
}
