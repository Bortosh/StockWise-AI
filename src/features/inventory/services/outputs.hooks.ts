import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Output, CreateOutputRequest } from '@/core/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// GET all outputs
export function useOutputs() {
  return useQuery({
    queryKey: ['outputs'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/outputs`);
      if (!response.ok) throw new Error('Failed to fetch outputs');
      return response.json() as Promise<Output[]>;
    },
  });
}

// GET weekly outputs
export function useWeeklyOutputs() {
  return useQuery({
    queryKey: ['outputs', 'weekly'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/outputs/weekly`);
      if (!response.ok) throw new Error('Failed to fetch weekly outputs');
      return response.json() as Promise<Output[]>;
    },
  });
}

// GET weekly summary
export function useWeeklySummary() {
  return useQuery({
    queryKey: ['outputs', 'weekly-summary'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/outputs/weekly-summary`);
      if (!response.ok) throw new Error('Failed to fetch weekly summary');
      return response.json();
    },
  });
}

// GET outputs by date range
export function useOutputsByDateRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['outputs', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      const response = await fetch(`${API_BASE}/outputs/by-date-range?${params}`);
      if (!response.ok) throw new Error('Failed to fetch outputs');
      return response.json() as Promise<Output[]>;
    },
  });
}

// CREATE output (salida)
export function useCreateOutput() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOutputRequest) => {
      const response = await fetch(`${API_BASE}/outputs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create output');
      return response.json() as Promise<Output>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outputs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

// DELETE output
export function useDeleteOutput() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/outputs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete output');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outputs'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

// Weekly reset (delete previous week's outputs)
export function useWeeklyReset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/outputs/reset/weekly`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to perform weekly reset');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outputs'] });
    },
  });
}
