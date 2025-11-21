import { useState } from 'react'
import { Button, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import WarningIcon from '@mui/icons-material/Warning'
import { useWeeklySummary, useWeeklyReset } from '../services/outputs.hooks'
import { useProducts } from '../../products/services/products.hooks'

export default function WeeklySummaryPage() {
    const { data: summary, isLoading } = useWeeklySummary()
    const { data: products = [] } = useProducts()
    const weeklyResetM = useWeeklyReset()

    const [resetOpen, setResetOpen] = useState(false)

    const handleReset = () => {
        weeklyResetM.mutate(undefined, {
            onSuccess: () => {
                setResetOpen(false)
            }
        })
    }

    const getProductName = (productId: string) => {
        return products.find(p => p.id === productId)?.name || 'Unknown'
    }

    const getDayName = (dateString: string) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const date = new Date(dateString)
        return days[date.getDay()]
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="text-gray-500">Cargando resumen semanal...</CardContent>
            </Card>
        )
    }

    const outputs = summary?.outputs || []
    const groupedByDay: Record<string, any[]> = {}

    outputs.forEach(output => {
        const day = output.date
        if (!groupedByDay[day]) {
            groupedByDay[day] = []
        }
        groupedByDay[day].push(output)
    })

    const sortedDays = Object.keys(groupedByDay).sort()

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Resumen Semanal (Semana {summary?.week})</Typography>
                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RefreshIcon />}
                    onClick={() => setResetOpen(true)}
                >
                    Reiniciar Semana
                </Button>
            </div>

            <Alert severity="info">
                📅 Esta vista muestra todas las salidas de stock de la semana actual (Lunes-Domingo).
                Cada lunes, las salidas de la semana anterior se eliminan automáticamente.
                El stock total NO se reinicia, solo el historial de salidas.
            </Alert>

            {outputs.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <Typography className="text-gray-500">
                            Sin salidas registradas esta semana aún.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card className="bg-blue-50">
                        <CardContent>
                            <Typography className="text-sm">
                                <span className="font-semibold">Total de Salidas Esta Semana:</span> {outputs.length}
                            </Typography>
                        </CardContent>
                    </Card>

                    {sortedDays.map(day => (
                        <Card key={day} className="card">
                            <CardContent>
                                <Typography variant="subtitle1" className="mb-4 font-semibold">
                                    {getDayName(day)} - {new Date(day).toLocaleDateString()}
                                </Typography>

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                        <TableRow className="bg-gray-50">
                                            <TableCell className="font-semibold">Producto</TableCell>
                                            <TableCell className="font-semibold">Área</TableCell>
                                            <TableCell align="right" className="font-semibold">Cantidad</TableCell>
                                            <TableCell className="font-semibold">Hora</TableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupedByDay[day].map(output => (
                                                <TableRow key={output.id} hover>
                                                    <TableCell>{getProductName(output.productId)}</TableCell>
                                                    <TableCell>{output.areaDestino}</TableCell>
                                                    <TableCell align="right">{output.quantity}</TableCell>
                                                    <TableCell>
                                                        {new Date(output.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Typography className="text-sm text-gray-600 mt-3">
                                    Total Diario: <span className="font-semibold">{groupedByDay[day].reduce((sum, o) => sum + o.quantity, 0)} unidades</span>
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </>
            )}

            {/* Reset Dialog */}
            <Dialog open={resetOpen} onClose={() => setResetOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle className="flex items-center gap-2">
                    <WarningIcon color="warning" />
                    Reinicio Semanal
                </DialogTitle>
                <DialogContent className="pt-4">
                    <Alert severity="warning" className="mb-4">
                        Esto eliminará todos los registros de salida de la semana anterior.
                        <strong>El stock total NO será afectado.</strong>
                    </Alert>
                    <Typography>
                        ¿Estás segura de que deseas proceder con el reinicio semanal?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleReset}
                        disabled={weeklyResetM.isPending}
                    >
                        {weeklyResetM.isPending ? 'Reiniciando...' : 'Confirmar Reinicio'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
