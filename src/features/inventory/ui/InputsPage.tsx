import { useState } from 'react'
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useProducts } from '../services/products.hooks'
import { useInputs, useCreateInput, useDeleteInput } from '../services/inputs.hooks'
import { Product, CreateInputRequest } from '@/core/types'

export default function InputsPage() {
    const { data: products = [], isLoading: productsLoading } = useProducts()
    const { data: inputs = [], isLoading: inputsLoading } = useInputs()
    const createM = useCreateInput()
    const deleteM = useDeleteInput()

    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<CreateInputRequest>({
        productId: '',
        quantity: 0,
        note: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.productId || form.quantity <= 0) return
        
        createM.mutate(form)
        setOpen(false)
        setForm({ productId: '', quantity: 0, note: '' })
    }

    const handleClose = () => {
        setOpen(false)
        setForm({ productId: '', quantity: 0, note: '' })
    }

    const getProductName = (productId: string) => {
        return products.find(p => p.id === productId)?.name || 'Unknown'
    }

    const isLoading = productsLoading || inputsLoading

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Stock Inputs (Entradas)</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Record Input
                </Button>
            </div>

            <Card className="card">
                <CardContent>
                    {isLoading ? (
                        <div className="text-gray-500">Loading inputs...</div>
                    ) : inputs.length === 0 ? (
                        <div className="text-gray-500 py-4">No inputs recorded yet</div>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow className="bg-gray-50">
                                        <TableCell className="font-semibold">Product</TableCell>
                                        <TableCell align="right" className="font-semibold">Quantity</TableCell>
                                        <TableCell className="font-semibold">Date</TableCell>
                                        <TableCell className="font-semibold">Note</TableCell>
                                        <TableCell align="center" className="font-semibold">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inputs.map(input => (
                                        <TableRow key={input.id} hover>
                                            <TableCell>{getProductName(input.productId)}</TableCell>
                                            <TableCell align="right">{input.quantity}</TableCell>
                                            <TableCell>{new Date(input.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{input.note || '—'}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteM.mutate(input.id)}
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
                    <DialogTitle>Record Stock Input</DialogTitle>
                    <DialogContent className="space-y-4 pt-4">
                        <FormControl fullWidth required>
                            <InputLabel>Product</InputLabel>
                            <Select
                                value={form.productId}
                                onChange={e => setForm({ ...form, productId: e.target.value })}
                            >
                                {products.map(p => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name} ({p.almacen})
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

                        <TextField
                            label="Note (optional)"
                            fullWidth
                            multiline
                            rows={2}
                            value={form.note || ''}
                            onChange={e => setForm({ ...form, note: e.target.value })}
                            placeholder="Add any notes about this input..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Record Input
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
