import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init';
import { Output, Product, CreateOutputRequest, BusinessArea, BUSINESS_AREAS } from '../types';

// Helper function: Get current week number
function getCurrentWeek(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek) + 1;
}

// Helper function: Check if today is Monday (returns true if it's Monday)
function isMonday(): boolean {
  return new Date().getDay() === 1;
}

// GET all outputs
export async function getOutputs(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const outputs = await db.all<Output[]>(
      `SELECT * FROM outputs ORDER BY date DESC, createdAt DESC`
    );
    res.json(outputs);
  } catch (error) {
    console.error('Error fetching outputs:', error);
    res.status(500).json({ error: 'Failed to fetch outputs' });
  }
}

// GET weekly outputs (current week)
export async function getWeeklyOutputs(req: Request, res: Response): Promise<void> {
  try {
    const currentWeek = getCurrentWeek();
    const db = getDatabase();
    const outputs = await db.all<Output[]>(
      `SELECT * FROM outputs WHERE week = ? ORDER BY date DESC, createdAt DESC`,
      [currentWeek]
    );
    res.json(outputs);
  } catch (error) {
    console.error('Error fetching weekly outputs:', error);
    res.status(500).json({ error: 'Failed to fetch weekly outputs' });
  }
}

// GET outputs by date range
export async function getOutputsByDateRange(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Missing required query parameters: startDate, endDate' });
      return;
    }

    const db = getDatabase();
    const outputs = await db.all<Output[]>(
      `SELECT * FROM outputs WHERE date BETWEEN ? AND ? ORDER BY date DESC, createdAt DESC`,
      [startDate, endDate]
    );
    res.json(outputs);
  } catch (error) {
    console.error('Error fetching outputs by date range:', error);
    res.status(500).json({ error: 'Failed to fetch outputs' });
  }
}

// POST create output (salida)
export async function createOutput(req: Request, res: Response): Promise<void> {
  try {
    const { productId, quantity, areaDestino }: CreateOutputRequest = req.body;

    // Validate input
    if (!productId || quantity === undefined || quantity <= 0 || !areaDestino) {
      res.status(400).json({
        error: 'Missing or invalid required fields: productId, quantity, areaDestino',
      });
      return;
    }

    if (!BUSINESS_AREAS.includes(areaDestino)) {
      res.status(400).json({ error: 'Invalid business area' });
      return;
    }

    const db = getDatabase();

    // Check if product exists
    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Verify areaDestino matches product's almacen
    if (product.almacen !== areaDestino) {
      res.status(400).json({
        error: `Product can only be distributed within its own area. Product area: ${product.almacen}, requested: ${areaDestino}`,
      });
      return;
    }

    // Check if product has sufficient stock
    if (product.stock < quantity) {
      res.status(400).json({
        error: `Insufficient stock. Available: ${product.stock}, requested: ${quantity}`,
      });
      return;
    }

    // Create output record
    const id = uuidv4();
    const now = new Date().toISOString();
    const date = now.split('T')[0]; // YYYY-MM-DD
    const week = getCurrentWeek();

    await db.run(
      'INSERT INTO outputs (id, productId, quantity, areaDestino, date, week, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, productId, quantity, areaDestino, date, week, now]
    );

    // Update product stock
    const newStock = product.stock - quantity;
    await db.run('UPDATE products SET stock = ?, updatedAt = ? WHERE id = ?', [newStock, now, productId]);

    const output = await db.get<Output>('SELECT * FROM outputs WHERE id = ?', [id]);
    res.status(201).json(output);
  } catch (error) {
    console.error('Error creating output:', error);
    res.status(500).json({ error: 'Failed to create output' });
  }
}

// DELETE output (revert salida)
export async function deleteOutput(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const output = await db.get<Output>('SELECT * FROM outputs WHERE id = ?', [id]);
    if (!output) {
      res.status(404).json({ error: 'Output not found' });
      return;
    }

    // Revert product stock
    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [output.productId]);
    if (product) {
      const newStock = product.stock + output.quantity;
      const now = new Date().toISOString();
      await db.run('UPDATE products SET stock = ?, updatedAt = ? WHERE id = ?', [newStock, now, output.productId]);
    }

    // Delete output
    await db.run('DELETE FROM outputs WHERE id = ?', [id]);
    res.json({ message: 'Output deleted successfully', output });
  } catch (error) {
    console.error('Error deleting output:', error);
    res.status(500).json({ error: 'Failed to delete output' });
  }
}

// DELETE weekly reset (runs every Monday to clear previous week's outputs)
export async function weeklyReset(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const currentWeek = getCurrentWeek();
    const previousWeek = currentWeek - 1;

    // Delete outputs from previous week
    const result = await db.run('DELETE FROM outputs WHERE week = ?', [previousWeek]);

    res.json({
      message: 'Weekly reset completed',
      deletedRecords: result.changes,
      previousWeekDeleted: previousWeek,
    });
  } catch (error) {
    console.error('Error performing weekly reset:', error);
    res.status(500).json({ error: 'Failed to perform weekly reset' });
  }
}

// Helper function to get summary stats for an output
async function getOutputWithProductInfo(db: any, output: Output): Promise<any> {
  const product = await db.get('SELECT * FROM products WHERE id = ?', [output.productId]);
  return {
    ...output,
    productName: product?.name || 'Unknown',
    almacen: product?.almacen || 'Unknown',
  };
}

// GET weekly summary with product details
export async function getWeeklySummary(req: Request, res: Response): Promise<void> {
  try {
    const currentWeek = getCurrentWeek();
    const db = getDatabase();

    const outputs = await db.all<Output[]>(
      `SELECT * FROM outputs WHERE week = ? ORDER BY date DESC, createdAt DESC`,
      [currentWeek]
    );

    // Enrich with product details
    const enrichedOutputs = await Promise.all(
      outputs.map((output) => getOutputWithProductInfo(db, output))
    );

    res.json({
      week: currentWeek,
      outputs: enrichedOutputs,
      totalOutputs: enrichedOutputs.length,
    });
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
}
