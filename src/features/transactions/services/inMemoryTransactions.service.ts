import type { TransactionsService } from "./transactions.service";
import type { Transaction } from "../../../core/types";

export function InMemoryTransactionsService(): TransactionsService {
    let data: Transaction[] = [];
    return {
        async list() { return data; },
        async create(t) {
            const item: Transaction = {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                ...t,
            };
            data.push(item);
            return item;
        },
        async remove(id) { data = data.filter(x => x.id !== id); },
    };
}
