import { useState } from 'react'
import { Button, Card, CardContent, Typography, Chip, Box, Dialog, DialogContent, DialogTitle, TextField, Alert } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import ShareIcon from '@mui/icons-material/Share'
import { useAlerts, useAlertsSummary, useFormatWhatsAppMessage } from '../services/alerts.hooks'
import { BUSINESS_AREAS } from '@/core/types'

export default function AlertsPage() {
    const { data: alerts = [], isLoading } = useAlerts()
    const { data: summary } = useAlertsSummary()
    const formatWhatsApp = useFormatWhatsAppMessage()

    const [selectedAlert, setSelectedAlert] = useState<any>(null)
    const [whatsappOpen, setWhatsappOpen] = useState(false)
    const [phone, setPhone] = useState('')
    const [shareUrl, setShareUrl] = useState<string | null>(null)

    const handleShareWhatsApp = (alert: any) => {
        setSelectedAlert(alert)
        setPhone('')
        setShareUrl(null)
        setWhatsappOpen(true)
    }

    const generateMessage = () => {
        if (!selectedAlert || !phone) return

        formatWhatsApp.mutate({
            productName: selectedAlert.productName,
            currentStock: selectedAlert.currentStock,
            minimumStock: selectedAlert.minimumStock,
            almacen: selectedAlert.almacen,
            phone,
        }, {
            onSuccess: (data) => {
                setShareUrl(data.whatsappUrl)
            }
        })
    }

    const openWhatsApp = () => {
        if (shareUrl) {
            window.open(shareUrl, '_blank')
        }
    }

    const closeDialog = () => {
        setWhatsappOpen(false)
        setSelectedAlert(null)
        setPhone('')
        setShareUrl(null)
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="text-gray-500">Loading alerts...</CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6">Stock Alerts</Typography>
                <Chip
                    icon={<WarningIcon />}
                    label={`${alerts.length} Active Alerts`}
                    color={alerts.length > 0 ? 'error' : 'default'}
                    variant="outlined"
                />
            </div>

            {alerts.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <Typography className="text-gray-500">
                            No stock alerts. All products are above minimum stock levels.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Alerts by Area */}
                    {BUSINESS_AREAS.map(area => {
                        const areaAlerts = alerts.filter(a => a.almacen === area)
                        if (areaAlerts.length === 0) return null

                        return (
                            <Card key={area} className="card">
                                <CardContent>
                                    <Typography variant="subtitle1" className="mb-4 font-semibold flex items-center gap-2">
                                        <WarningIcon color="error" fontSize="small" />
                                        {area}
                                    </Typography>

                                    <div className="space-y-3">
                                        {areaAlerts.map(alert => (
                                            <Box
                                                key={alert.id}
                                                className="p-4 bg-red-50 rounded-lg border border-red-200"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <Typography className="font-semibold text-red-900">
                                                            {alert.productName}
                                                        </Typography>
                                                        <Typography className="text-sm text-red-800 mt-1">
                                                            Current Stock: <span className="font-semibold">{alert.currentStock}</span>
                                                        </Typography>
                                                        <Typography className="text-sm text-red-800">
                                                            Minimum Required: <span className="font-semibold">{alert.minimumStock}</span>
                                                        </Typography>
                                                        <Typography className="text-xs text-red-700 mt-2">
                                                            Deficit: <span className="font-semibold">{alert.minimumStock - alert.currentStock}</span> units
                                                        </Typography>
                                                    </div>

                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<ShareIcon />}
                                                        onClick={() => handleShareWhatsApp(alert)}
                                                        className="ml-4"
                                                    >
                                                        Share
                                                    </Button>
                                                </div>
                                            </Box>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {/* Summary Statistics */}
                    <Card className="bg-blue-50 border border-blue-200">
                        <CardContent>
                            <Typography variant="subtitle1" className="font-semibold mb-3">
                                📊 Summary
                            </Typography>
                            <div className="space-y-1">
                                <Typography className="text-sm">
                                    <span className="font-semibold">Total Alerts:</span> {alerts.length}
                                </Typography>
                                <Typography className="text-sm">
                                    <span className="font-semibold">Affected Areas:</span> {Object.keys(summary?.alertsSummary || {}).length}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* WhatsApp Share Dialog */}
            <Dialog open={whatsappOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>Share Alert via WhatsApp</DialogTitle>
                <DialogContent className="space-y-4 pt-4">
                    {selectedAlert && (
                        <>
                            <Alert severity="info">
                                Alert: <strong>{selectedAlert.productName}</strong> - Stock: {selectedAlert.currentStock} (Min: {selectedAlert.minimumStock})
                            </Alert>

                            <TextField
                                label="Phone Number"
                                fullWidth
                                placeholder="+1234567890"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                helperText="Enter the recipient's phone number with country code"
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                onClick={generateMessage}
                                disabled={!phone}
                            >
                                Generate Message
                            </Button>

                            {shareUrl && (
                                <div className="space-y-3 pt-4 border-t">
                                    <Alert severity="success">
                                        Message ready to share!
                                    </Alert>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="success"
                                        onClick={openWhatsApp}
                                    >
                                        Open WhatsApp
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
