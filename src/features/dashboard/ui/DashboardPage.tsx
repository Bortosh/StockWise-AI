import { Card, CardContent, Typography } from '@mui/material'
import { useDashboardKPIs } from '../services/dashboard.hooks'

const KPICard = ({ title, value }: { title: string; value: string }) => (
    <Card className="card">
        <CardContent className="!py-3">
            <Typography variant="overline">{title}</Typography>
            <Typography variant="h5">{value}</Typography>
        </CardContent>
    </Card>
)

export default function DashboardPage() {
    const { totalSkus, stockValue, lowStockCount } = useDashboardKPIs()

    return (
        <div className="space-y-6">
            <div className="h-2 w-full bg-primary"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <KPICard title="Total Items (SKUs)" value={String(totalSkus)} />
                <KPICard title="Stock Value" value={new Intl.NumberFormat().format(stockValue)} />
                <KPICard title="Low Stock" value={String(lowStockCount)} />
            </div>

            <Card className="card">
                <CardContent>
                    <Typography variant="h6">Recent Activity</Typography>
                    <div className="muted">Coming soon…</div>
                </CardContent>
            </Card>
        </div>
    )
}
