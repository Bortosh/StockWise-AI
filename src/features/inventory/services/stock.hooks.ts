import { useMemo } from 'react'
import { useProducts } from '../../products/services/products.hooks'
import { useTransactions } from '../../transactions/services/transactions.hooks'

export function useStockMap() {
    const { data: products = [] } = useProducts()
    const { data: txs = [] } = useTransactions()

    const stockMap = useMemo(() => {
        const m = new Map<string, number>()
        for (const t of txs) {
            const prev = m.get(t.productId) ?? 0
            m.set(t.productId, prev + (t.type === 'IN' ? t.qty : -t.qty))
        }
        return m
    }, [txs])

    return { products, stockMap }
}
