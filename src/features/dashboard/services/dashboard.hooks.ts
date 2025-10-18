import { useMemo } from 'react'
import { useProducts } from '../../products/services/products.hooks'
import { useTransactions } from '../../transactions/services/transactions.hooks'

export function useDashboardKPIs() {
    const { data: products = [] } = useProducts()
    const { data: txs = [] } = useTransactions()

    const { stockMap, stockValue, lowStockCount } = useMemo(() => {
        const stockMap = new Map<string, number>()
        for (const t of txs) {
            const prev = stockMap.get(t.productId) ?? 0
            stockMap.set(t.productId, prev + (t.type === 'IN' ? t.qty : -t.qty))
        }
        let stockValue = 0
        let lowStockCount = 0
        for (const p of products) {
            const qty = stockMap.get(p.id) ?? 0
            const unitCost = p.unitCost ?? 0
            stockValue += qty * unitCost
            if ((p.minStock ?? 0) > 0 && qty < (p.minStock ?? 0)) lowStockCount++
        }
        return { stockMap, stockValue, lowStockCount }
    }, [products, txs])

    return {
        totalSkus: products.length,
        stockValue,
        lowStockCount,
        stockMap,
    }
}
