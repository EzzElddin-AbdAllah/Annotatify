import dbData from "@/data/db.json";

export const STORAGE_KEYS = {
  IMAGES: "images",
  CATEGORIES: "categories",
  ANNOTATIONS: "annotations",
} as const;

export function getData<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function setData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export async function initializeData<T>(key: string): Promise<T[]> {
  if (typeof window === "undefined") return [];

  const existingData = localStorage.getItem(key);
  if (existingData) {
    return JSON.parse(existingData);
  }

  const seedData = dbData[key as keyof typeof dbData] as T[];
  localStorage.setItem(key, JSON.stringify(seedData));
  return seedData;
}

export function clearData(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
