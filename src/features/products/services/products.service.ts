import type { Product } from "../../../core/types";

export interface ProductsService {
    list(): Promise<Product[]>;
    create(p: Omit<Product, "id">): Promise<Product>;
    update(id: string, patch: Partial<Product>): Promise<Product>;
    remove(id: string): Promise<void>;
}
