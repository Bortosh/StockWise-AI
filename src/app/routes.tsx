import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from './RequireAuth'
import LoginPage from '../features/auth/ui/LoginPage'
import DashboardPage from '../features/dashboard/ui/DashboardPage'
import AppShell from './AppShell'
import ProductsPage from '../features/products/ui/ProductsPage'
import TransactionsPage from '../features/transactions/ui/TransactionsPage'
import InvoicesPage from '../features/invoices/ui/InvoicesPage'


export const router = createBrowserRouter([
    { path: '/auth/login', element: <LoginPage /> },
    {
        path: '/app',
        element: <RequireAuth />,
        children: [
            {
                element: <AppShell />,
                children: [
                    { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'products', element: <ProductsPage /> },
                    { path: 'transactions', element: <TransactionsPage /> },
                    { path: 'settings', element: <div>Settings</div> },
                    { path: 'invoices', element: <InvoicesPage /> },
                ],
            },
        ],
    },
    { path: '*', element: <LoginPage /> },
])