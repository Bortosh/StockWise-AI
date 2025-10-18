import { createContext, useContext, PropsWithChildren } from "react";
import type { ProductsService } from "../../features/products/services/products.service";
import type { TransactionsService } from "../../features/transactions/services/transactions.service";
import { PurchaseInvoicesService } from "../../features/invoices/services/purchaseInvoices.service";

type Services = {
    products: ProductsService;
    transactions: TransactionsService;
    invoices: PurchaseInvoicesService;
};

const ServicesContext = createContext<Services | null>(null);

export function ServicesProvider({ services, children }: PropsWithChildren<{ services: Services }>) {
    return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices() {
    const ctx = useContext(ServicesContext);
    if (!ctx) throw new Error("Services not provided");
    return ctx;
}
