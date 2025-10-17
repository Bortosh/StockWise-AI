export interface User {
    id: string
    email: string
    name?: string
}

export interface Product {
    id: string
    name: string
    sku?: string
    unitCost?: number
    unit?: string
    minStock?: number
}

export interface Transaction {
    id: string
    productId: string
    type: 'IN' | 'OUT'
    qty: number
    note?: string
    createdAt: string
}
