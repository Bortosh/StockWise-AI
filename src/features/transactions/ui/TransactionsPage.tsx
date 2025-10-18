import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useTransactions, useCreateTransaction, useRemoveTransaction } from '../services/transactions.hooks'
import { useStockMap } from '../../inventory/services/stock.hooks'

export default function TransactionsPage() {
    // Solo necesitamos las transacciones para la tabla
    const { data: txs = [] } = useTransactions()
    const createM = useCreateTransaction()
    const removeM = useRemoveTransaction()

    const [open, setOpen] = useState(false)
    // Movimientos aquí son SOLO salidas:
    const [form, setForm] = useState({ productId: '', qty: 1, note: '' })

    // OJO: renombramos products para no chocar con el de arriba
    const { products: productsWithStock, stockMap } = useStockMap()
    const selectable = productsWithStock.filter(p => (stockMap.get(p.id) ?? 0) > 0)

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!form.productId || form.qty <= 0) return
        const available = stockMap.get(form.productId) ?? 0
        if (form.qty > available) {
            alert(`No hay suficiente stock. Disponible: ${available}`)
            return
        }
        // Forzamos OUT (salida)
        createM.mutate({ productId: form.productId, type: 'OUT', qty: form.qty, note: form.note })
        setOpen(false)
        setForm({ productId: '', qty: 1, note: '' })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Movimientos</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>Nuevo movimiento</Button>
            </div>

            <Card className="card">
                <CardContent>
                    {txs.length === 0 ? (
                        <div className="muted py-4">Sin movimientos</div>
                    ) : (
                        <div className="space-y-2">
                            <div className="grid grid-cols-12 text-sm muted font-semibold">
                                <div className="col-span-4">Producto</div>
                                <div className="col-span-2">Tipo</div>
                                <div className="col-span-2">Cantidad</div>
                                <div className="col-span-3">Nota</div>
                                <div className="col-span-1">Acciones</div>
                            </div>
                            {txs.map(t => {
                                const p = productsWithStock.find(x => x.id === t.productId)
                                return (
                                    <div key={t.id} className="grid grid-cols-12 items-center py-1">
                                        <div className="col-span-4">{p?.name ?? '—'}</div>
                                        <div className="col-span-2">{t.type}</div>
                                        <div className="col-span-2">{t.qty}</div>
                                        <div className="col-span-3">{t.note || '—'}</div>
                                        <div className="col-span-1">
                                            <IconButton size="small" onClick={() => removeM.mutate(t.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <form onSubmit={submit}>
                    <DialogTitle>Salida de stock</DialogTitle>
                    <DialogContent className="space-y-3 pt-2">
                        <Select
                            fullWidth
                            value={form.productId}
                            displayEmpty
                            onChange={e => setForm(s => ({ ...s, productId: String(e.target.value) }))}
                        >
                            <MenuItem value="">Selecciona producto con stock…</MenuItem>
                            {selectable.map(p => {
                                const qty = stockMap.get(p.id) ?? 0
                                return (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name} — {qty} disp.
                                    </MenuItem>
                                )
                            })}
                        </Select>

                        <TextField
                            type="number"
                            label="Cantidad"
                            value={form.qty}
                            onChange={e => setForm(s => ({ ...s, qty: Number(e.target.value) }))}
                            inputProps={{ min: 1 }}
                        />

                        <TextField
                            label="Nota"
                            value={form.note}
                            onChange={e => setForm(s => ({ ...s, note: e.target.value }))}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" variant="contained">Crear</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
