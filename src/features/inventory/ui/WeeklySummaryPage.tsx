import { useState } from 'react'
import { Button, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import WarningIcon from '@mui/icons-material/Warning'
import { useWeeklySummary, useWeeklyReset } from '../services/outputs.hooks'
import { useProducts } from '../services/products.hooks'

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
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const date = new Date(dateString)
        return days[date.getDay()]
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="text-gray-500">Loading weekly summary...</CardContent>
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
                <Typography variant="h6">Weekly Summary (Week {summary?.week})</Typography>
                <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<RefreshIcon />}
                    onClick={() => setResetOpen(true)}
                >
                    Reset Week
                </Button>
            </div>

            <Alert severity="info">
                📅 This view shows all stock outputs for the current week (Monday-Sunday).
                Every Monday, the previous week's outputs are automatically cleared.
                The stock totals are NOT reset, only the output history.
            </Alert>

            {outputs.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <Typography className="text-gray-500">
                            No outputs recorded this week yet.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card className="bg-blue-50">
                        <CardContent>
                            <Typography className="text-sm">
                                <span className="font-semibold">Total Outputs This Week:</span> {outputs.length}
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
                                                <TableCell className="font-semibold">Product</TableCell>
                                                <TableCell className="font-semibold">Area</TableCell>
                                                <TableCell align="right" className="font-semibold">Quantity</TableCell>
                                                <TableCell className="font-semibold">Time</TableCell>
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
                                    Daily Total: <span className="font-semibold">{groupedByDay[day].reduce((sum, o) => sum + o.quantity, 0)} units</span>
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
                    Weekly Reset
                </DialogTitle>
                <DialogContent className="pt-4">
                    <Alert severity="warning" className="mb-4">
                        This will delete all output records from the previous week.
                        <strong>Stock totals will NOT be affected.</strong>
                    </Alert>
                    <Typography>
                        Are you sure you want to proceed with the weekly reset?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleReset}
                        disabled={weeklyResetM.isPending}
                    >
                        {weeklyResetM.isPending ? 'Resetting...' : 'Confirm Reset'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
