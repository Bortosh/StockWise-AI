import { Request, Response } from 'express';
import { getDatabase } from '../database/init';
import { Product, StockAlert } from '../types';

// GET all active stock alerts
export async function getAlerts(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const products = await db.all<Product[]>('SELECT * FROM products ORDER BY almacen, name');

    // Filter products with stock below minimum
    const alerts: StockAlert[] = products
      .filter((product) => product.stock < product.minimumStock)
      .map((product) => ({
        id: product.id,
        productId: product.id,
        productName: product.name,
        almacen: product.almacen,
        currentStock: product.stock,
        minimumStock: product.minimumStock,
        timestamp: new Date().toISOString(),
      }));

    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
}

// GET alerts by area
export async function getAlertsByArea(req: Request, res: Response): Promise<void> {
  try {
    const { almacen } = req.params;
    const db = getDatabase();

    const products = await db.all<Product[]>(
      'SELECT * FROM products WHERE almacen = ? ORDER BY name',
      [almacen]
    );

    const alerts: StockAlert[] = products
      .filter((product) => product.stock < product.minimumStock)
      .map((product) => ({
        id: product.id,
        productId: product.id,
        productName: product.name,
        almacen: product.almacen,
        currentStock: product.stock,
        minimumStock: product.minimumStock,
        timestamp: new Date().toISOString(),
      }));

    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts by area:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
}

// POST format WhatsApp message (generates shareable message)
export async function formatWhatsAppMessage(req: Request, res: Response): Promise<void> {
  try {
    const { productName, currentStock, minimumStock, almacen, phone } = req.body;

    if (!productName || currentStock === undefined || !minimumStock || !almacen) {
      res.status(400).json({
        error: 'Missing required fields: productName, currentStock, minimumStock, almacen',
      });
      return;
    }

    const message = `🚨 *Alerta de Stock*\n\n` +
      `Producto: ${productName}\n` +
      `Área: ${almacen}\n` +
      `Stock actual: ${currentStock}\n` +
      `Stock mínimo: ${minimumStock}\n\n` +
      `⚠️ El producto está por debajo del stock mínimo.`;

    const whatsappUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null;

    res.json({
      message,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error formatting WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to format message' });
  }
}

// GET alerts summary by area
export async function getAlertsSummary(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const products = await db.all<Product[]>('SELECT * FROM products');

    const alertsByArea: Record<string, StockAlert[]> = {};

    products.forEach((product) => {
      if (product.stock < product.minimumStock) {
        if (!alertsByArea[product.almacen]) {
          alertsByArea[product.almacen] = [];
        }

        alertsByArea[product.almacen].push({
          id: product.id,
          productId: product.id,
          productName: product.name,
          almacen: product.almacen,
          currentStock: product.stock,
          minimumStock: product.minimumStock,
          timestamp: new Date().toISOString(),
        });
      }
    });

    res.json({
      alertsSummary: alertsByArea,
      totalAlerts: Object.values(alertsByArea).reduce((acc, alerts) => acc + alerts.length, 0),
    });
  } catch (error) {
    console.error('Error fetching alerts summary:', error);
    res.status(500).json({ error: 'Failed to fetch alerts summary' });
  }
}
