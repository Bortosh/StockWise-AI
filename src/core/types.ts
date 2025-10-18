import type { Unit } from './units';
export type TransactionSource = 'INVOICE' | 'MANUAL';

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

export interface PurchaseInvoice {
    id: string;
    number: string;
    supplier?: string;
    date: string; // ISO yyyy-mm-dd
    items: PurchaseInvoiceLine[];
}

export interface PurchaseInvoiceLine {
    productId: string;
    qty: number;
    unit: Unit;           // unidad de la línea (puede ser distinta a la base)
    unitCost?: number;
    note?: string;
}