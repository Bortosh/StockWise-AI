import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, CreateInputRequest } from '@/core/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// GET all inputs
export function useInputs() {
  return useQuery({
    queryKey: ['inputs'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/inputs`);
      if (!response.ok) throw new Error('Failed to fetch inputs');
      return response.json() as Promise<Input[]>;
    },
  });
}

// GET inputs by date range
export function useInputsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['inputs', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      const response = await fetch(`${API_BASE}/inputs/by-date-range?${params}`);
      if (!response.ok) throw new Error('Failed to fetch inputs');
      return response.json() as Promise<Input[]>;
    },
  });
}

// CREATE input (entrada)
export function useCreateInput() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInputRequest) => {
      const response = await fetch(`${API_BASE}/inputs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create input');
      return response.json() as Promise<Input>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inputs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// DELETE input
export function useDeleteInput() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/inputs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete input');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inputs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
