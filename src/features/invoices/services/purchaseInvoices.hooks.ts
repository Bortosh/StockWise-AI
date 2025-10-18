// src/features/invoices/services/purchaseInvoices.hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServices } from '@/infra/adapters/services.provider'
import { toBase } from '@/core/units' // usa alias @ si puedes
import type { Product, PurchaseInvoice } from '@/core/types'

export const INVOICES_KEY = ['invoices'] as const
export const TXS_KEY = ['transactions'] as const

export function useInvoices() {
    const { invoices } = useServices()
    return useQuery({
        queryKey: INVOICES_KEY,
        queryFn: () => invoices.list(),
        staleTime: 0,
        refetchOnMount: 'always',
        notifyOnChangeProps: 'all',
    })
}

function toBaseSafe(qty: number, from: string, base?: string) {
    const resolvedBase = (base as any) ?? from
    if (from === resolvedBase) return qty
    try {
        return toBase(qty, from as any, resolvedBase as any)
    } catch {
        console.warn(`Sin conversión definida ${from}->${resolvedBase}. Se usará qty tal cual.`)
        return qty
    }
}

export function useCreateInvoice(products: Product[]) {
    const { invoices, transactions } = useServices()
    const qc = useQueryClient()
    const productsMap = new Map(products.map(p => [p.id, p]))

    return useMutation({
        mutationFn: async (inv: Omit<PurchaseInvoice, 'id'>) => {

            const created = await invoices.create(inv)

            for (const line of created.items) {
                const p = productsMap.get(line.productId)
                if (!p) {
                    console.warn('Producto no encontrado para línea:', line)
                    continue
                }

                const qtyBase = toBaseSafe(line.qty, line.unit as any, (p as any).unit)

                await transactions.create({
                    productId: line.productId,
                    type: 'IN',
                    qty: qtyBase,
                    note: line.note,
                    createdAt: new Date().toISOString(),
                } as any)
            }

            return created
        },

        onError: (err) => {
            console.error('[createInvoice] ERROR ->', err)
            alert('No se pudo crear la factura. Revisa consola para detalles.')
        },

        onSuccess: async (created) => {
            await qc.cancelQueries({ queryKey: INVOICES_KEY })

            qc.setQueryData<PurchaseInvoice[]>(INVOICES_KEY, (prev) =>
                prev ? [...prev, created] : [created]
            )

            await qc.refetchQueries({ queryKey: INVOICES_KEY, type: 'active' })
            await qc.refetchQueries({ queryKey: TXS_KEY, type: 'active' })
        },
    })
}
