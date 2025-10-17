import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/auth.store'

export default function RequireAuth() {
const isAuth = useAuthStore((s) => s.isAuthenticated)
return isAuth ? <Outlet /> : <Navigate to="/auth/login" replace />
}