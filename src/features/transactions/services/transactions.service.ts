import type { Transaction } from "../../../core/types";

export interface TransactionsService {
    list(): Promise<Transaction[]>;
    create(t: Omit<Transaction, "id" | "createdAt">): Promise<Transaction>;
    remove(id: string): Promise<void>;
}
