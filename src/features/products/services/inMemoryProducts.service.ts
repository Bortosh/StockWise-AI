import type { ProductsService } from './products.service'
import type { Product } from '../../../core/types'

export function InMemoryProductsService(): ProductsService {
    let data: Product[] = []
    return {
        async list() { return data },
        async create(p) {
            const item: Product = { id: crypto.randomUUID(), ...p }
            data.push(item)
            return item
        },
        async update(id, patch) {
            data = data.map(x => x.id === id ? { ...x, ...patch } : x)
            const found = data.find(x => x.id === id)
            if (!found) throw new Error('Product not found')
            return found
        },
        async remove(id) { data = data.filter(x => x.id !== id) },
    }
}
