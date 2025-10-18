import type { PurchaseInvoice } from '../../../core/types';

export interface PurchaseInvoicesService {
    list(): Promise<PurchaseInvoice[]>;
    create(inv: Omit<PurchaseInvoice, 'id'>): Promise<PurchaseInvoice>;
}