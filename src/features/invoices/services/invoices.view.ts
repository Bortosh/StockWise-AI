import { useMemo, useState } from 'react'
import { useInvoices } from './purchaseInvoices.hooks'
import { useProducts } from '../../products/services/products.hooks'

export function useInvoicesView() {
    const { data: invoices = [] } = useInvoices()
    const { data: products = [] } = useProducts()
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products])

    const view = useMemo(() => invoices.map(inv => ({
        ...inv,
        itemsView: inv.items.map(line => ({
            ...line,
            productName: productMap.get(line.productId)?.name ?? '—',
        })),
    })), [invoices, productMap])

    const selected = useMemo(() => view.find(v => v.id === selectedId) ?? null, [view, selectedId])

    return { invoices: view, selected, setSelectedId }
}
