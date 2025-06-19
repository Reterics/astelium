import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {baseURL, getFetchOptions} from '../utils/utils.ts';
import {parseDateStrings, parseDateStringsInItem} from '../utils/dateUtils.ts';

export interface UseApiProps {
  perPage: number;
}

export class UseApiError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

type UseApiReturnValueType = string|number|boolean;

export const useApi = <T = Record<string, UseApiReturnValueType>>(endpoint: string, options?: UseApiProps) => {
  const queryClient = useQueryClient();

  const fetchData = async ({pageParam = 1}) => {
    const perPage = options?.perPage ?? 10;
    const pageUrl = `${baseURL}/api/${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${pageParam}&per_page=${perPage}`;
    const response = await fetch(pageUrl, {
      ...getFetchOptions(),
    });

    if (
      response.status === 401 &&
      !location.pathname.endsWith('/login') &&
      !location.pathname.endsWith('/register') &&
      !location.pathname.endsWith('/appointments') &&
      location.pathname !== baseURL + '/'
    ) {
      console.warn('Session expired, navigate to login page');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = baseURL + '/login';
      return;
    }

    if (!response.ok) {
      throw new UseApiError('Failed to fetch ${endpoint}', response.status);
    }

    const data = await response.json();

    if (data.data && data.current_page !== undefined) {
      data.data = parseDateStrings(data?.data)
      return data;
    } else {
      return {
        data: Array.isArray(data) ? parseDateStrings(data) : data,
        current_page: 1,
        next_page_url: null,
        first_page_url: pageUrl,
        per_page: 10,
        to: null,
        total: (data || []).length,
      };
    }
  };

  const {data, error, isLoading, hasNextPage, hasPreviousPage, fetchNextPage} =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: [endpoint],
      queryFn: fetchData,
      getNextPageParam: (lastPage) => lastPage.next_page_url ?? undefined,
      retry: (failureCount, error: any) => {
        // Do not retry on 401 - Unauthorized
        if (error?.code === 401) return false;
        return failureCount < 3;
      },
    });

  const createMutation = useMutation({
    mutationFn: async (newData: T) => {
      // Check if any field contains a File object
      const hasFileUpload = Object.values(newData as Record<string, unknown>).some(
        (value) => value instanceof File
      );

      let formData: FormData | string;

      if (hasFileUpload) {
        formData = new FormData();

        Object.entries(newData as Record<string, unknown>).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            (formData as FormData).append(key, value instanceof File ? value : String(value));
          }
        });
      } else {
        formData = JSON.stringify(newData);
      }

      // For appointments, use the authenticated endpoint if a token exists
      let apiEndpoint = endpoint;
      if (endpoint === 'appointments' && localStorage.getItem('token')) {
        apiEndpoint = 'appointments/authenticated';
      }

      const response = await fetch(`${baseURL}/api/${apiEndpoint}`, {
        ...getFetchOptions(hasFileUpload),
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
      const data = await response.json()
      return data ? parseDateStringsInItem(data) : data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: [endpoint]});
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (props: T & {id: number}) => {
      // Check if any field contains a File object
      const hasFileUpload = Object.values(props as Record<string, unknown>).some(
        (value) => value instanceof File
      );

      let formData: FormData | string;

      if (hasFileUpload) {
        formData = new FormData();

        Object.entries(props as Record<string, unknown>).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            (formData as FormData).append(key, value instanceof File ? value : String(value));
          }
        });
      } else {
        formData = JSON.stringify(props);
      }

      const response = await fetch(`${baseURL}/api/${endpoint}/${props.id}`, {
        ...getFetchOptions(hasFileUpload),
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
      const data = await response.json()
      return data ? parseDateStringsInItem(data) : data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: [endpoint]});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${baseURL}/api/${endpoint}/${id}`, {
        ...getFetchOptions(),
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Failed to delete ${endpoint}`);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: [endpoint]});
    },
  });

  const getImageUrl = (imagePath?: string) => {
    return imagePath ? `/storage/${imagePath}` : null;
  };

  return {
    data:
      (data?.pages.flatMap((page) => page.data ?? page) as T[]) || [],
    error,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    getImageUrl,
  };
};
