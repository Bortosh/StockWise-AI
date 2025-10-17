import { createBrowserRouter } from 'react-router-dom'
import RequireAuth from './RequireAuth'
import LoginPage from '../features/auth/ui/LoginPage'
import DashboardPage from '../features/dashboard/ui/DashboardPage'
import AppShell from './AppShell'


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
                    { path: 'products', element: <div>Products</div> },
                    { path: 'transactions', element: <div>Transactions</div> },
                    { path: 'settings', element: <div>Settings</div> },
                ],
            },
        ],
    },
    { path: '*', element: <LoginPage /> },
])