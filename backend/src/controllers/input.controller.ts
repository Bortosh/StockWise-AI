import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init.js';
import { Input, Product, CreateInputRequest } from '../types.js';

// GET all inputs
export async function getInputs(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const inputs = await db.all<Input[]>(
      `SELECT * FROM inputs ORDER BY date DESC, createdAt DESC`
    );
    res.json(inputs);
  } catch (error) {
    console.error('Error fetching inputs:', error);
    res.status(500).json({ error: 'Failed to fetch inputs' });
  }
}

// GET inputs by date range
export async function getInputsByDateRange(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Missing required query parameters: startDate, endDate' });
      return;
    }

    const db = getDatabase();
    const inputs = await db.all<Input[]>(
      `SELECT * FROM inputs WHERE date BETWEEN ? AND ? ORDER BY date DESC, createdAt DESC`,
      [startDate, endDate]
    );
    res.json(inputs);
  } catch (error) {
    console.error('Error fetching inputs by date range:', error);
    res.status(500).json({ error: 'Failed to fetch inputs' });
  }
}

// POST create input (entrada)
export async function createInput(req: Request, res: Response): Promise<void> {
  try {
    const { productId, quantity, note }: CreateInputRequest = req.body;

    // Validate input
    if (!productId || quantity === undefined || quantity <= 0) {
      res.status(400).json({ error: 'Missing or invalid required fields: productId, quantity' });
      return;
    }

    const db = getDatabase();

    // Check if product exists
    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Create input record
    const id = uuidv4();
    const now = new Date().toISOString();
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    await db.run(
      'INSERT INTO inputs (id, productId, quantity, date, note, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [id, productId, quantity, date, note || null, now]
    );

    // Update product stock
    const newStock = product.stock + quantity;
    await db.run('UPDATE products SET stock = ?, updatedAt = ? WHERE id = ?', [newStock, now, productId]);

    const input = await db.get<Input>('SELECT * FROM inputs WHERE id = ?', [id]);
    res.status(201).json(input);
  } catch (error) {
    console.error('Error creating input:', error);
    res.status(500).json({ error: 'Failed to create input' });
  }
}

// DELETE input (revert entrada)
export async function deleteInput(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const input = await db.get<Input>('SELECT * FROM inputs WHERE id = ?', [id]);
    if (!input) {
      res.status(404).json({ error: 'Input not found' });
      return;
    }

    // Revert product stock
    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [input.productId]);
    if (product) {
      const newStock = Math.max(0, product.stock - input.quantity);
      const now = new Date().toISOString();
      await db.run('UPDATE products SET stock = ?, updatedAt = ? WHERE id = ?', [newStock, now, input.productId]);
    }

    // Delete input
    await db.run('DELETE FROM inputs WHERE id = ?', [id]);
    res.json({ message: 'Input deleted successfully', input });
  } catch (error) {
    console.error('Error deleting input:', error);
    res.status(500).json({ error: 'Failed to delete input' });
  }
}
