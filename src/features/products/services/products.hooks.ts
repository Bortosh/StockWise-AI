import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Product, CreateProductRequest, UpdateProductRequest, BusinessArea } from '../../../core/types'
import { useServices } from '@/infra/adapters/services.provider'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const USE_API = import.meta.env.VITE_USE_API === 'true'

const key = ['products']

export function useProducts() {
    const { products } = useServices()
    
    return useQuery({
        queryKey: key,
        queryFn: USE_API
            ? async () => {
                const response = await fetch(`${API_BASE}/products`)
                if (!response.ok) throw new Error('Failed to fetch products')
                return response.json() as Promise<Product[]>
              }
            : () => products.list(),
    })
}

export function useProductsByArea(almacen: BusinessArea) {
    return useQuery({
        queryKey: [key, almacen],
        queryFn: async () => {
            const response = await fetch(`${API_BASE}/products/area/${almacen}`)
            if (!response.ok) throw new Error('Failed to fetch products')
            return response.json() as Promise<Product[]>
        },
    })
}

export function useCreateProduct() {
    const qc = useQueryClient()
    const { products } = useServices()
    
    return useMutation({
        mutationFn: USE_API
            ? async (data: CreateProductRequest) => {
                const response = await fetch(`${API_BASE}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                if (!response.ok) throw new Error('Failed to create product')
                return response.json() as Promise<Product>
              }
            : (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => products.create(p as any),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}

export function useUpdateProduct() {
    const qc = useQueryClient()
    const { products } = useServices()
    
    return useMutation({
        mutationFn: USE_API
            ? async ({ id, data }: { id: string; data: UpdateProductRequest }) => {
                const response = await fetch(`${API_BASE}/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                if (!response.ok) throw new Error('Failed to update product')
                return response.json() as Promise<Product>
              }
            : ({ id, patch }: { id: string; patch: Partial<Product> }) =>
                products.update(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}

export function useRemoveProduct() {
    const qc = useQueryClient()
    const { products } = useServices()
    
    return useMutation({
        mutationFn: USE_API
            ? async (id: string) => {
                const response = await fetch(`${API_BASE}/products/${id}`, {
                    method: 'DELETE',
                })
                if (!response.ok) throw new Error('Failed to delete product')
                return response.json()
              }
            : (id: string) => products.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}

