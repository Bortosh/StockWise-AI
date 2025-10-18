import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ServicesProvider } from '@/infra/adapters/services.provider'
import { InMemoryProductsService } from './features/products/services/inMemoryProducts.service'
import { InMemoryTransactionsService } from './features/transactions/services/inMemoryTransactions.service'
import { InMemoryPurchaseInvoicesService } from './features/invoices/services/inMemoryPurchaseInvoices.service'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2563eb' },
    background: { default: '#0b0c10', paper: '#111214' },
    text: { secondary: '#6b7280' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Inter, system-ui, Arial, sans-serif' },
})

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: false,
      structuralSharing: false, // evita que una ref igual silencie el render
    },
  },
})

const services = {
  products: InMemoryProductsService(),
  transactions: InMemoryTransactionsService(),
  invoices: InMemoryPurchaseInvoicesService()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <ServicesProvider services={services}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ServicesProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
