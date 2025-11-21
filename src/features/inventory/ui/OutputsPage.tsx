import { useState } from 'react'
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useProducts } from '../services/products.hooks'
import { useOutputs, useCreateOutput, useDeleteOutput, useWeeklyOutputs } from '../services/outputs.hooks'
import { Product, CreateOutputRequest, BusinessArea } from '@/core/types'

export default function OutputsPage() {
    const { data: products = [], isLoading: productsLoading } = useProducts()
    const { data: outputs = [], isLoading: outputsLoading } = useWeeklyOutputs()
    const createM = useCreateOutput()
    const deleteM = useDeleteOutput()

    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<CreateOutputRequest>({
        productId: '',
        quantity: 0,
        areaDestino: BusinessArea.PIZZERIA,
    })
    const [error, setError] = useState<string | null>(null)

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!form.productId || form.quantity <= 0) {
            setError('Please select a product and enter a quantity')
            return
        }

        const product = products.find(p => p.id === form.productId)
        if (!product) {
            setError('Product not found')
            return
        }

        if (product.stock < form.quantity) {
            setError(`Insufficient stock. Available: ${product.stock}`)
            return
        }

        if (product.almacen !== form.areaDestino) {
            setError(`Product can only be distributed within its own area (${product.almacen})`)
            return
        }

        createM.mutate(form)
        setOpen(false)
        setForm({ productId: '', quantity: 0, areaDestino: BusinessArea.PIZZERIA })
    }

    const handleClose = () => {
        setOpen(false)
        setForm({ productId: '', quantity: 0, areaDestino: BusinessArea.PIZZERIA })
        setError(null)
    }

    const handleProductChange = (productId: string) => {
        const product = products.find(p => p.id === productId)
        setForm({
            ...form,
            productId,
            areaDestino: product?.almacen || BusinessArea.PIZZERIA,
        })
    }

    const getProductName = (productId: string) => {
        return products.find(p => p.id === productId)?.name || 'Unknown'
    }

    const getProductArea = (productId: string) => {
        return products.find(p => p.id === productId)?.almacen || 'Unknown'
    }

    const isLoading = productsLoading || outputsLoading

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Stock Outputs (Salidas - Current Week)</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Record Output
                </Button>
            </div>

            <Card className="card">
                <CardContent>
                    {isLoading ? (
                        <div className="text-gray-500">Loading outputs...</div>
                    ) : outputs.length === 0 ? (
                        <div className="text-gray-500 py-4">No outputs recorded this week</div>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow className="bg-gray-50">
                                        <TableCell className="font-semibold">Product</TableCell>
                                        <TableCell className="font-semibold">Area</TableCell>
                                        <TableCell align="right" className="font-semibold">Quantity</TableCell>
                                        <TableCell className="font-semibold">Date</TableCell>
                                        <TableCell align="center" className="font-semibold">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {outputs.map(output => (
                                        <TableRow key={output.id} hover>
                                            <TableCell>{getProductName(output.productId)}</TableCell>
                                            <TableCell>{getProductArea(output.productId)}</TableCell>
                                            <TableCell align="right">{output.quantity}</TableCell>
                                            <TableCell>{new Date(output.date).toLocaleDateString()}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteM.mutate(output.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <form onSubmit={submit}>
                    <DialogTitle>Record Stock Output</DialogTitle>
                    <DialogContent className="space-y-4 pt-4">
                        {error && <Alert severity="error">{error}</Alert>}

                        <FormControl fullWidth required>
                            <InputLabel>Product</InputLabel>
                            <Select
                                value={form.productId}
                                onChange={e => handleProductChange(e.target.value)}
                            >
                                {products.map(p => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name} (Stock: {p.stock}, Area: {p.almacen})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Quantity"
                            fullWidth
                            type="number"
                            required
                            value={form.quantity}
                            onChange={e => setForm({ ...form, quantity: Math.max(0, Number(e.target.value)) })}
                            inputProps={{ min: 1 }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Distribution Area</InputLabel>
                            <Select
                                value={form.areaDestino}
                                onChange={e => setForm({ ...form, areaDestino: e.target.value as BusinessArea })}
                                disabled
                            >
                                <MenuItem value={form.areaDestino}>{form.areaDestino}</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Record Output
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
