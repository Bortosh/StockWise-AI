import { useQuery, useMutation } from '@tanstack/react-query';
import { StockAlert } from '@/core/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// GET all alerts
export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return response.json() as Promise<StockAlert[]>;
    },
  });
}

// GET alerts summary
export function useAlertsSummary() {
  return useQuery({
    queryKey: ['alerts', 'summary'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/alerts/summary`);
      if (!response.ok) throw new Error('Failed to fetch alerts summary');
      return response.json();
    },
  });
}

// Format WhatsApp message
export function useFormatWhatsAppMessage() {
  return useMutation({
    mutationFn: async (data: {
      productName: string;
      currentStock: number;
      minimumStock: number;
      almacen: string;
      phone?: string;
    }) => {
      const response = await fetch(`${API_BASE}/alerts/format-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to format message');
      return response.json() as Promise<{ message: string; whatsappUrl: string | null }>;
    },
  });
}
