import type { Unit } from './units';

export type TransactionSource = 'INVOICE' | 'MANUAL';

// Business areas
export enum BusinessArea {
  PIZZERIA = 'Pizzería',
  HELADERIA = 'Heladería',
  COCINA_PRINCIPAL = 'Cocina principal',
  DON_ANTONIO = 'Don Antonio',
}

export const BUSINESS_AREAS = Object.values(BusinessArea);

export interface User {
  id: string;
  email: string;
  name?: string;
}

// Product with proper business logic
export interface Product {
  id: string;
  name: string;
  stock: number;
  minimumStock: number;
  almacen: BusinessArea;
  createdAt: string;
  updatedAt: string;
}

// Legacy Product type (keeping for backward compatibility)
export interface LegacyProduct {
  id: string;
  name: string;
  sku?: string;
  unitCost?: number;
  unit?: string;
  minStock?: number;
}

// Input (Entrada) - when stock increases
export interface Input {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  note?: string;
  createdAt: string;
}

// Output (Salida) - when stock decreases
export interface Output {
  id: string;
  productId: string;
  quantity: number;
  areaDestino: BusinessArea;
  date: string;
  week: number;
  createdAt: string;
}

// Stock Alert
export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  almacen: BusinessArea;
  currentStock: number;
  minimumStock: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  productId: string;
  type: 'IN' | 'OUT';
  qty: number;
  note?: string;
  createdAt: string;
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