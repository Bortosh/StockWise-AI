import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { Button, TextField, Card, CardContent, Typography } from '@mui/material'
import { useState } from 'react'

export default function LoginPage() {
    const navigate = useNavigate()
    const login = useAuthStore((s) => s.login)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.includes('@') || password.length < 6) return
        login()
        navigate('/app/dashboard')
    }


    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardContent>
                    <Typography variant="h6" gutterBottom>Sign in to StockWise AI</Typography>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <TextField label="Email" type="email" size="small" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <TextField label="Password" type="password" size="small" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Button type="submit" variant="contained">Sign In</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}