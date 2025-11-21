import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database | null = null;

export async function initializeDatabase(): Promise<Database> {
  let dbPath = process.env.DATABASE_PATH;
  
  if (!dbPath) {
    // Fallback: use absolute path to data directory
    const projectRoot = path.resolve(__dirname, '../../');
    dbPath = path.join(projectRoot, 'data', 'inventory.db');
  }
  
  // Normalize path
  dbPath = path.resolve(dbPath);
  const dbDir = path.dirname(dbPath);

  // Ensure data directory exists
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`✓ Created directory: ${dbDir}`);
    }
  } catch (err) {
    console.error(`✗ Failed to create directory: ${dbDir}`, err);
    throw err;
  }

  console.log(`✓ Opening database at: ${dbPath}`);

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log(`✓ Database connection established`);
  } catch (err) {
    console.error(`✗ Failed to open database:`, err);
    throw err;
  }

  await db.exec('PRAGMA foreign_keys = ON');
  console.log(`✓ Foreign keys enabled`);

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      minimumStock INTEGER NOT NULL DEFAULT 0,
      almacen TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inputs (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS outputs (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      areaDestino TEXT NOT NULL,
      date TEXT NOT NULL,
      week INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_inputs_productId ON inputs(productId);
    CREATE INDEX IF NOT EXISTS idx_inputs_date ON inputs(date);
    CREATE INDEX IF NOT EXISTS idx_outputs_productId ON outputs(productId);
    CREATE INDEX IF NOT EXISTS idx_outputs_date ON outputs(date);
    CREATE INDEX IF NOT EXISTS idx_outputs_week ON outputs(week);
  `);
  console.log(`✓ Database tables and indexes created`);

  return db;
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
