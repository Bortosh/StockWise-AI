// src/features/invoices/services/inMemoryPurchaseInvoices.service.ts
import type { PurchaseInvoicesService } from './purchaseInvoices.service'
import type { PurchaseInvoice } from '../../../core/types'

export function InMemoryPurchaseInvoicesService(): PurchaseInvoicesService {
    let data: PurchaseInvoice[] = []

    return {
        async list() {
            // devolver SIEMPRE nueva referencia (y clonar items)
            return data.map(inv => ({ ...inv, items: inv.items.map(it => ({ ...it })) }))
        },

        async create(inv) {
            const item: PurchaseInvoice = { id: crypto.randomUUID(), ...inv }
            // reasignar array (no usar push)
            data = [...data, item]
            // devolver copia inmutable igual que en list
            return { ...item, items: item.items.map(it => ({ ...it })) }
        },
    }
}
