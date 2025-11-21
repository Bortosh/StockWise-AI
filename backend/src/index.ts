import express, { Express } from 'express';
import { initializeDatabase, closeDatabase } from './database/init';
import { corsMiddleware } from './middleware/cors';

import productsRouter from './routes/products.routes';
import inputsRouter from './routes/inputs.routes';
import outputsRouter from './routes/outputs.routes';
import alertsRouter from './routes/alerts.routes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/products', productsRouter);
app.use('/api/inputs', inputsRouter);
app.use('/api/outputs', outputsRouter);
app.use('/api/alerts', alertsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`📍 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...');
  await closeDatabase();
  process.exit(0);
});

startServer();
