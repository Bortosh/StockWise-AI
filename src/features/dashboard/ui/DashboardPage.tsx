import { Card, CardContent, Typography, Grid } from '@mui/material'

const KPICard = ({ title, value }: { title: string; value: string }) => (
    <Card>
        <CardContent>
            <Typography variant="overline">{title}</Typography>
            <Typography variant="h5">{value}</Typography>
        </CardContent>
    </Card>
)


export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}><KPICard title="Total Items" value="—" /></Grid>
                <Grid item xs={12} md={4}><KPICard title="Stock Value" value="—" /></Grid>
                <Grid item xs={12} md={4}><KPICard title="Low Stock" value="—" /></Grid>
            </Grid>
            <Card>
                <CardContent>
                    <Typography variant="h6">Recent Activity</Typography>
                    <div className="text-muted">Coming soon…</div>
                </CardContent>
            </Card>
        </div>
    )
}