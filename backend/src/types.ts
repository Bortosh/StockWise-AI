// Business areas
export enum BusinessArea {
  PIZZERIA = 'Pizzería',
  HELADERIA = 'Heladería',
  COCINA_PRINCIPAL = 'Cocina principal',
  DON_ANTONIO = 'Don Antonio',
}

export const BUSINESS_AREAS = Object.values(BusinessArea);

// Product types
export interface Product {
  id: string;
  name: string;
  stock: number;
  minimumStock: number;
  almacen: BusinessArea;
  createdAt: string;
  updatedAt: string;
}

// Input (Entrada) types
export interface Input {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  note?: string;
  createdAt: string;
}

// Output (Salida) types
export interface Output {
  id: string;
  productId: string;
  quantity: number;
  areaDestino: BusinessArea;
  date: string;
  week: number;
  createdAt: string;
}

// Alert types
export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  almacen: BusinessArea;
  currentStock: number;
  minimumStock: number;
  timestamp: string;
}

// API Request/Response types
export interface CreateProductRequest {
  name: string;
  minimumStock: number;
  almacen: BusinessArea;
}

export interface CreateInputRequest {
  productId: string;
  quantity: number;
  note?: string;
}

export interface CreateOutputRequest {
  productId: string;
  quantity: number;
  areaDestino: BusinessArea;
}

export interface UpdateProductRequest {
  name?: string;
  minimumStock?: number;
}
