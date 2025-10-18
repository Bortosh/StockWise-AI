import { useState } from 'react'
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useProducts, useCreateProduct, useUpdateProduct, useRemoveProduct } from '../services/products.hooks'

export default function ProductsPage() {
    const { data = [], isLoading } = useProducts()
    const createM = useCreateProduct()
    const updateM = useUpdateProduct()
    const removeM = useRemoveProduct()

    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({ name: '', sku: '', unitCost: 0, unit: 'unit', minStock: 0 })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return
        if (editingId) updateM.mutate({ id: editingId, patch: form })
        else createM.mutate(form)
        setOpen(false); setEditingId(null); setForm({ name: '', sku: '', unitCost: 0, unit: 'unit', minStock: 0 })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Products</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>New Product</Button>
            </div>

            <Card className="card">
                <CardContent>
                    {isLoading ? <div className="muted">Loading…</div> : (
                        <div className="space-y-2">
                            <div className="grid grid-cols-12 text-sm muted font-semibold">
                                <div className="col-span-4">Name</div>
                                <div className="col-span-2">SKU</div>
                                <div className="col-span-2">Unit Cost</div>
                                <div className="col-span-2">Unit</div>
                                <div className="col-span-2">Actions</div>
                            </div>
                            {data.length === 0 && <div className="muted py-4">No products yet</div>}
                            {data.map(p => (
                                <div key={p.id} className="grid grid-cols-12 items-center py-1">
                                    <div className="col-span-4">{p.name}</div>
                                    <div className="col-span-2">{p.sku || '—'}</div>
                                    <div className="col-span-2">{p.unitCost ?? '—'}</div>
                                    <div className="col-span-2">{p.unit ?? '—'}</div>
                                    <div className="col-span-2">
                                        <IconButton size="small" onClick={() => { setEditingId(p.id); setForm({ name: p.name, sku: p.sku ?? '', unitCost: p.unitCost ?? 0, unit: p.unit ?? 'unit', minStock: p.minStock ?? 0 }); setOpen(true) }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => removeM.mutate(p.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => { setOpen(false); setEditingId(null) }} fullWidth maxWidth="sm">
                <form onSubmit={submit}>
                    <DialogTitle>{editingId ? 'Edit Product' : 'New Product'}</DialogTitle>
                    <DialogContent className="space-y-3 pt-2">
                        <TextField label="Name" fullWidth required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                            <TextField label="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                            <TextField label="Unit Cost" type="number" value={form.unitCost} onChange={e => setForm({ ...form, unitCost: Number(e.target.value) })} />
                            <TextField label="Unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
                            <TextField label="Min Stock" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: Number(e.target.value) })} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">{editingId ? 'Save' : 'Create'}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
