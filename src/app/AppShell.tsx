import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, Button } from '@mui/material'
import { useState } from 'react'
import { useAuthStore } from '../features/auth/store/auth.store'
import MenuIcon from '@mui/icons-material/Menu'

const nav = [
    { to: '/app/dashboard', label: 'Dashboard' },
    { to: '/app/products', label: 'Products' },
    { to: '/app/invoices', label: 'Facturas' },
    { to: '/app/transactions', label: 'Movimientos' },
    { to: '/app/settings', label: 'Ajustes' },
]

export default function AppShell() {
    const [open, setOpen] = useState(true)
    const logout = useAuthStore((s) => s.logout)
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/auth/login') }

    return (
        <div className="min-h-screen grid" style={{ gridTemplateColumns: open ? '240px 1fr' : '150px 1fr' }}>
            <Drawer
                variant="permanent"
                open={open}
                PaperProps={{
                    sx: {
                        bgcolor: 'background.default', // pared lateral igual al fondo
                        color: 'text.primary',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                <Toolbar className="!min-h-[56px]" />
                <List>
                    {nav.map((item) => (
                        <ListItem key={item.to} disablePadding>
                            <ListItemButton component={NavLink} to={item.to}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <div className="flex flex-col">
                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{
                        bgcolor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Toolbar className="flex gap-2">
                        <IconButton edge="start" onClick={() => setOpen((v) => !v)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className="flex-1">StockWise AI</Typography>
                        <Button onClick={handleLogout}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}