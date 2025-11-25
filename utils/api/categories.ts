import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category";
import {
  STORAGE_KEYS,
  getData,
  setData,
  initializeData,
} from "@/utils/storage";

export async function fetchCategories(): Promise<Category[]> {
  return initializeData<Category>(STORAGE_KEYS.CATEGORIES);
}

export async function fetchCategoryById(id: number): Promise<Category> {
  const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
  const category = categories.find((cat) => cat.id === id);
  if (!category) {
    throw new Error(`Category ${id} not found`);
  }
  return category;
}

export async function createCategory(
  data: CreateCategoryDto
): Promise<Category> {
  const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);

  const maxId =
    categories.length > 0 ? Math.max(...categories.map((cat) => cat.id)) : 0;

  const newCategory: Category = {
    ...data,
    id: maxId + 1,
    description: data.description || "",
    image: `https://picsum.photos/500/300?random=${maxId + 1}`,
  };
  setData(STORAGE_KEYS.CATEGORIES, [...categories, newCategory]);
  return newCategory;
}

export async function updateCategory(
  id: number,
  data: UpdateCategoryDto
): Promise<Category> {
  const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) {
    throw new Error(`Category ${id} not found`);
  }

  const updatedCategory = { ...categories[index], ...data };
  categories[index] = updatedCategory;
  setData(STORAGE_KEYS.CATEGORIES, categories);
  return updatedCategory;
}

export async function deleteCategory(id: number): Promise<void> {
  const categories = getData<Category>(STORAGE_KEYS.CATEGORIES);
  const filteredCategories = categories.filter((cat) => cat.id !== id);
  if (filteredCategories.length === categories.length) {
    throw new Error(`Category ${id} not found`);
  }
  setData(STORAGE_KEYS.CATEGORIES, filteredCategories);
}
