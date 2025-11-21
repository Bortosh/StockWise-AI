import { useState } from 'react'
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Box, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import WarningIcon from '@mui/icons-material/Warning'
import { useProducts, useCreateProduct, useUpdateProduct, useRemoveProduct } from '../services/products.hooks'
import { BUSINESS_AREAS, BusinessArea, Product } from '@/core/types'

export default function ProductsPage() {
    const { data = [], isLoading } = useProducts()
    const createM = useCreateProduct()
    const updateM = useUpdateProduct()
    const removeM = useRemoveProduct()

    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({
        name: '',
        minimumStock: 0,
        almacen: BusinessArea.PIZZERIA as BusinessArea,
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return
        
        if (editingId) {
            updateM.mutate({
                id: editingId,
                data: { name: form.name, minimumStock: form.minimumStock }
            })
        } else {
            createM.mutate({
                name: form.name,
                minimumStock: form.minimumStock,
                almacen: form.almacen,
            })
        }
        
        setOpen(false)
        setEditingId(null)
        setForm({ name: '', minimumStock: 0, almacen: BusinessArea.PIZZERIA })
    }

    const handleEdit = (product: Product) => {
        setEditingId(product.id)
        setForm({
            name: product.name,
            minimumStock: product.minimumStock,
            almacen: product.almacen,
        })
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setEditingId(null)
        setForm({ name: '', minimumStock: 0, almacen: BusinessArea.PIZZERIA })
    }

    const isLowStock = (product: Product) => product.stock < product.minimumStock

    // Group products by area
    const groupedByArea = BUSINESS_AREAS.reduce((acc, area) => {
        acc[area] = data.filter(p => p.almacen === area)
        return acc
    }, {} as Record<BusinessArea, Product[]>)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Gestión de Productos</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>+ Nuevo Producto</Button>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="text-gray-500">Cargando productos...</CardContent>
                </Card>
            ) : (
                BUSINESS_AREAS.map(area => (
                    <Card key={area} className="card">
                        <CardContent>
                            <Typography variant="subtitle1" className="mb-4 font-semibold">{area}</Typography>
                            
                            {groupedByArea[area].length === 0 ? (
                                <div className="text-gray-500 py-4">No hay productos en esta área</div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-12 text-sm text-gray-600 font-semibold mb-2">
                                        <div className="col-span-4">Nombre</div>
                                        <div className="col-span-2">Stock</div>
                                        <div className="col-span-2">Stock Mín</div>
                                        <div className="col-span-2">Estado</div>
                                        <div className="col-span-2">Acciones</div>
                                    </div>
                                    
                                    {groupedByArea[area].map(p => (
                                        <div key={p.id} className={`grid grid-cols-12 items-center p-2 rounded ${isLowStock(p) ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                            <div className="col-span-4 font-medium">{p.name}</div>
                                            <div className="col-span-2">{p.stock}</div>
                                            <div className="col-span-2">{p.minimumStock}</div>
                                            <div className="col-span-2">
                                                {isLowStock(p) ? (
                                                    <Chip icon={<WarningIcon />} label="Stock Bajo" color="error" size="small" />
                                                ) : (
                                                    <Chip label="OK" color="success" size="small" />
                                                )}
                                            </div>
                                            <div className="col-span-2 flex gap-1">
                                                <IconButton size="small" onClick={() => handleEdit(p)}>
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
                ))
            )}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <form onSubmit={submit}>
                    <DialogTitle>{editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
                    <DialogContent className="space-y-4 pt-4">
                        <TextField
                            label="Nombre del Producto"
                            fullWidth
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="ej. Mozzarella"
                        />
                        
                        <TextField
                            label="Stock Mínimo"
                            fullWidth
                            type="number"
                            value={form.minimumStock}
                            onChange={e => setForm({ ...form, minimumStock: Math.max(0, Number(e.target.value)) })}
                            inputProps={{ min: 0 }}
                        />

                        {!editingId && (
                            <FormControl fullWidth>
                                <InputLabel>Área</InputLabel>
                                <Select
                                    value={form.almacen}
                                    onChange={e => setForm({ ...form, almacen: e.target.value as BusinessArea })}
                                >
                                    {BUSINESS_AREAS.map(area => (
                                        <MenuItem key={area} value={area}>{area}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" variant="contained">
                            {editingId ? 'Guardar Cambios' : 'Crear Producto'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
