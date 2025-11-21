import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/init.js';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  BusinessArea,
  BUSINESS_AREAS,
} from '../types.js';

// GET all products
export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const db = getDatabase();
    const products = await db.all<Product[]>('SELECT * FROM products ORDER BY almacen, name');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// GET products by area
export async function getProductsByArea(req: Request, res: Response): Promise<void> {
  try {
    const { almacen } = req.params;

    if (!BUSINESS_AREAS.includes(almacen as BusinessArea)) {
      res.status(400).json({ error: 'Invalid business area' });
      return;
    }

    const db = getDatabase();
    const products = await db.all<Product[]>(
      'SELECT * FROM products WHERE almacen = ? ORDER BY name',
      [almacen]
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by area:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

// GET single product
export async function getProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

// POST create product
export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const { name, minimumStock, almacen }: CreateProductRequest = req.body;

    // Validate input
    if (!name || minimumStock === undefined || !almacen) {
      res.status(400).json({ error: 'Missing required fields: name, minimumStock, almacen' });
      return;
    }

    if (!BUSINESS_AREAS.includes(almacen)) {
      res.status(400).json({ error: 'Invalid business area' });
      return;
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const db = getDatabase();
    await db.run(
      'INSERT INTO products (id, name, stock, minimumStock, almacen, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, 0, minimumStock, almacen, now, now]
    );

    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
}

// PUT update product
export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { name, minimumStock }: UpdateProductRequest = req.body;

    const db = getDatabase();
    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updatedName = name ?? product.name;
    const updatedMinimumStock = minimumStock ?? product.minimumStock;
    const now = new Date().toISOString();

    await db.run(
      'UPDATE products SET name = ?, minimumStock = ?, updatedAt = ? WHERE id = ?',
      [updatedName, updatedMinimumStock, now, id]
    );

    const updated = await db.get<Product>('SELECT * FROM products WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// DELETE product
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const product = await db.get<Product>('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await db.run('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
