import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServices } from '@/infra/adapters/services.provider'
import type { Transaction } from '../../../core/types'

const key = ['transactions']

export function useTransactions() {
    const { transactions } = useServices()
    return useQuery({ queryKey: key, queryFn: () => transactions.list() })
}

export function useCreateTransaction() {
    const qc = useQueryClient()
    const { transactions } = useServices()
    return useMutation({
        mutationFn: (t: Omit<Transaction, 'id' | 'createdAt'>) => transactions.create(t),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}

export function useRemoveTransaction() {
    const qc = useQueryClient()
    const { transactions } = useServices()
    return useMutation({
        mutationFn: (id: string) => transactions.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    })
}
