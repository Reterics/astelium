import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {getFetchOptions} from '../utils/utils.ts';

export interface UseApiProps {
  perPage: number;
}

export const useApi = (endpoint: string, options?: UseApiProps) => {
  const queryClient = useQueryClient();

  const fetchData = async ({pageParam = 1}) => {
    const perPage = options?.perPage ?? 10;
    const pageUrl = `/api/${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${pageParam}&per_page=${perPage}`;
    const response = await fetch(pageUrl, {
      ...getFetchOptions(),
    });

    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);

    const data = await response.json();

    if (data.data && data.current_page !== undefined) {
      return data;
    } else {
      return {
        data: data || [],
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
    });

  const createMutation = useMutation({
    mutationFn: async (newData: Record<string, any>) => {
      const fileUpload = newData.image instanceof File;

      let formData: FormData|string;

      if (fileUpload) {
        formData = new FormData();

        Object.entries(newData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            (formData as FormData).append(key, value);
          }
        });
      } else {
        formData = JSON.stringify(newData);
      }

      const response = await fetch(`/api/${endpoint}`, {
        ...getFetchOptions(fileUpload),
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
      return response.json();
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: [endpoint]});
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (props: Record<string, any> & {id: number}) => {
      const fileUpload = props.image instanceof File;

      let formData: FormData|string;

      if (fileUpload) {
        formData = new FormData();

        Object.entries(props).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            (formData as FormData).append(key, value);
          }
        });
      } else {
        formData = JSON.stringify(props);
      }

      const response = await fetch(`/api/${endpoint}/${props.id}`, {
        ...getFetchOptions(fileUpload),
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
      return response.json();
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({queryKey: [endpoint]});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/${endpoint}/${id}`, {
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
      (data?.pages.flatMap((page) => page.data ?? page) as Record<
        string,
        any
      >[]) || [],
    error,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    getImageUrl
  };
};
