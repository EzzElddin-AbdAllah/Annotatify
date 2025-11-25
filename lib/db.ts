import fs from "fs/promises";
import path from "path";
import type { Category } from "@/types/category";
import type { Image } from "@/types/image";
import type { Annotation } from "@/types/annotation";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface DB {
  categories: Category[];
  images: Image[];
  annotations: Annotation[];
}

export async function readDb(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { categories: [], images: [], annotations: [] };
  }
}

export async function writeDb(data: DB): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getItems<K extends keyof DB>(
  collection: K
): Promise<DB[K]> {
  const db = await readDb();
  return db[collection];
}

export async function getItem<K extends keyof DB>(
  collection: K,
  id: string
): Promise<DB[K][number] | undefined> {
  const db = await readDb();
  return db[collection].find((item: any) => item.id === id);
}

export async function createItem<K extends keyof DB>(
  collection: K,
  item: any
): Promise<DB[K][number]> {
  const db = await readDb();

  if (!item.id) {
    item.id = Math.random().toString(36).substr(2, 9);
  }

  if (!item.createdAt && collection !== "images") {
    item.createdAt = new Date().toISOString();
  }

  db[collection].push(item);
  await writeDb(db);
  return item;
}

export async function updateItem<K extends keyof DB>(
  collection: K,
  id: string,
  updates: Partial<DB[K][number]>
): Promise<DB[K][number] | null> {
  const db = await readDb();
  const index = db[collection].findIndex((item: any) => item.id === id);
  if (index === -1) return null;

  db[collection][index] = { ...db[collection][index], ...updates };
  await writeDb(db);
  return db[collection][index];
}

export async function deleteItem(
  collection: keyof DB,
  id: string
): Promise<boolean> {
  const db = await readDb();
  const initialLength = db[collection].length;
  db[collection] = db[collection].filter((item: any) => item.id !== id) as any;

  if (db[collection].length !== initialLength) {
    await writeDb(db);
    return true;
  }
  return false;
}
