import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Product } from '../../../core/types'
import { useServices } from '@/infra/adapters/services.provider'

const key = ['products']

export function useProducts() {
    const { products } = useServices()
    return useQuery({ queryKey: key, queryFn: () => products.list() })
}

export function useCreateProduct() {
    const qc = useQueryClient()
    const { products } = useServices()
    return useMutation({
        mutationFn: (p: Omit<Product, 'id'>) => products.create(p),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}

export function useUpdateProduct() {
    const qc = useQueryClient()
    const { products } = useServices()
    return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Partial<Product> }) =>
            products.update(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}

export function useRemoveProduct() {
    const qc = useQueryClient()
    const { products } = useServices()
    return useMutation({
        mutationFn: (id: string) => products.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}
