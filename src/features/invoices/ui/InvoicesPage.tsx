import { useMemo, useState } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useProducts } from '../../products/services/products.hooks';
import { useCreateInvoice } from '../services/purchaseInvoices.hooks';
import type { Unit } from '../../../core/units';
import { useInvoicesView } from '../services/invoices.view';
import { todayLocal } from '../../../shared/hooks/date';

type Line = { productId: string; qty: number; unit: Unit; unitCost?: number; note?: string };

export default function InvoicesPage() {
    const { data: products = [] } = useProducts();
    const createInvoice = useCreateInvoice(products);
    const { invoices: invoicesView, selected, setSelectedId } = useInvoicesView();

    const [open, setOpen] = useState(false);
    const [header, setHeader] = useState({ number: '', supplier: '', date: todayLocal() });
    const [lines, setLines] = useState<Line[]>([{ productId: '', qty: 1, unit: 'kg' }]);

    // 👇 Lista sin filtros; solo ordenamos por fecha DESC (más reciente arriba)
    const list = useMemo(
        () => [...invoicesView].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
        [invoicesView]
    )


    const addLine = () => setLines(ls => [...ls, { productId: '', qty: 1, unit: 'kg' }]);
    const removeLine = (idx: number) => setLines(ls => ls.filter((_, i) => i !== idx));

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!header.number || !header.date) return
        if (lines.some(l => !l.productId || l.qty <= 0)) return

        setOpen(false)
        // 👇 quita el foco del botón dentro del dialog para que no quede oculto
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }

        createInvoice.mutate({
            number: header.number,
            supplier: header.supplier,
            date: header.date,
            items: lines.map(l => ({ ...l })),
        })

        setHeader({ number: '', supplier: '', date: todayLocal() })
        setLines([{ productId: '', qty: 1, unit: 'kg' }])
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Facturas</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>Nueva factura</Button>
            </div>

            <Card className="card">
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 text-sm muted font-semibold">
                            <div className="col-span-3">Nº Factura</div>
                            <div className="col-span-3">Proveedor</div>
                            <div className="col-span-3">Fecha</div>
                            <div className="col-span-3">Ítems</div>
                        </div>
                        {list.length === 0 && <div className="muted py-4">Sin facturas</div>}
                        {list.map(inv => (
                            <div
                                key={inv.id}
                                className="grid grid-cols-12 items-center py-1 cursor-pointer hover:bg-white/5 rounded-[8px] px-2"
                                onClick={() => setSelectedId(inv.id)}
                            >
                                <div className="col-span-3">{inv.number}</div>
                                <div className="col-span-3">{inv.supplier || '—'}</div>
                                <div className="col-span-3">{inv.date}</div>
                                <div className="col-span-3">{inv.items.length}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <form onSubmit={submit}>
                    <DialogTitle>Nueva factura</DialogTitle>
                    <DialogContent className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <TextField label="Nº Factura" value={header.number} onChange={e => setHeader(s => ({ ...s, number: e.target.value }))} required />
                            <TextField label="Proveedor" value={header.supplier} onChange={e => setHeader(s => ({ ...s, supplier: e.target.value }))} />
                            <TextField type="date" label="Fecha" InputLabelProps={{ shrink: true }} value={header.date} onChange={e => setHeader(s => ({ ...s, date: e.target.value }))} required />
                        </div>

                        <div className="space-y-2">
                            <Typography variant="subtitle2">Productos de la factura</Typography>
                            {lines.map((l, i) => (
                                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-4">
                                        <Select fullWidth value={l.productId} displayEmpty onChange={e => setLines(arr => { const c = [...arr]; c[i] = { ...c[i], productId: String(e.target.value) }; return c; })}>
                                            <MenuItem value="">Selecciona producto…</MenuItem>
                                            {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <TextField type="number" label="Cantidad" value={l.qty} onChange={e => setLines(arr => { const c = [...arr]; c[i] = { ...c[i], qty: Number(e.target.value) }; return c; })} />
                                    </div>
                                    <div className="col-span-3">
                                        <Select fullWidth value={l.unit} onChange={e => setLines(arr => { const c = [...arr]; c[i] = { ...c[i], unit: e.target.value as Unit }; return c; })}>
                                            {['unit', 'kg', 'g', 'L', 'ml'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                                        </Select>
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <IconButton onClick={() => removeLine(i)}><DeleteIcon fontSize="small" /></IconButton>
                                    </div>
                                </div>
                            ))}
                            <div><Button onClick={addLine}>Añadir línea</Button></div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" variant="contained">Guardar</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={Boolean(selected)} onClose={() => setSelectedId(null)} fullWidth maxWidth="md" keepMounted disableRestoreFocus>
                <DialogTitle>Factura {selected?.number}</DialogTitle>
                <DialogContent className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 muted">
                        <div><strong>Proveedor:</strong> {selected?.supplier || '—'}</div>
                        <div><strong>Fecha:</strong> {selected?.date}</div>
                        <div><strong>Ítems:</strong> {selected?.items.length}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 text-sm muted font-semibold">
                            <div className="col-span-5">Producto</div>
                            <div className="col-span-2">Cantidad</div>
                            <div className="col-span-2">Unidad</div>
                            <div className="col-span-3">Nota</div>
                        </div>
                        {selected?.itemsView.map((it, i) => (
                            <div key={i} className="grid grid-cols-12 items-center py-1">
                                <div className="col-span-5">{it.productName}</div>
                                <div className="col-span-2">{it.qty}</div>
                                <div className="col-span-2">{it.unit}</div>
                                <div className="col-span-3">{it.note || '—'}</div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedId(null)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
