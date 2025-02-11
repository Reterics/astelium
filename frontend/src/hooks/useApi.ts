import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {getFetchOptions} from "../utils.ts";

export const useApi = (endpoint: string) => {
  const queryClient = useQueryClient();

  const fetchData = async () => {
    const response = await fetch(`/api/${endpoint}`, {
      ...getFetchOptions(),
    });
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: fetchData,
  });

  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      const response = await fetch(`/api/${endpoint}`, {
        ...getFetchOptions(),
        method: 'POST',
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error(`Failed to create ${endpoint}`);
      return response.json();
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (props: Record<string, any> & {id: number}) => {
      const response = await fetch(`/api/${endpoint}/${props.id}`, {
        ...getFetchOptions(),
        method: 'PUT',
        body: JSON.stringify(props),
      });
      if (!response.ok) throw new Error(`Failed to update ${endpoint}`);
      return response.json();
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [endpoint] });
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
      return queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
  });

  return {
    data,
    error,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
