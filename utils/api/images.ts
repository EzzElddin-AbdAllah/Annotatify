import type { Image, CreateImageDto, UpdateImageDto } from "@/types/image";
import {
  STORAGE_KEYS,
  getData,
  setData,
  initializeData,
} from "@/utils/storage";

export async function fetchImages(): Promise<Image[]> {
  return initializeData<Image>(STORAGE_KEYS.IMAGES);
}

export async function fetchImageById(id: number): Promise<Image> {
  const images = getData<Image>(STORAGE_KEYS.IMAGES);
  const image = images.find((img) => img.id === id);
  if (!image) {
    throw new Error(`Image ${id} not found`);
  }
  return image;
}

export async function createImage(data: CreateImageDto): Promise<Image> {
  const images = getData<Image>(STORAGE_KEYS.IMAGES);

  const maxId =
    images.length > 0 ? Math.max(...images.map((img) => img.id)) : 0;

  const newImage: Image = {
    ...data,
    id: maxId + 1,
    uploadDate: new Date().toISOString(),
    metadata: data.metadata || { size: "0MB", resolution: "0x0" },
  };
  setData(STORAGE_KEYS.IMAGES, [...images, newImage]);
  return newImage;
}

export async function updateImage(
  id: number,
  data: UpdateImageDto
): Promise<Image> {
  const images = getData<Image>(STORAGE_KEYS.IMAGES);
  const index = images.findIndex((img) => img.id === id);
  if (index === -1) {
    throw new Error(`Image ${id} not found`);
  }

  const updatedImage = { ...images[index], ...data };
  images[index] = updatedImage;
  setData(STORAGE_KEYS.IMAGES, images);
  return updatedImage;
}

export async function deleteImage(id: number): Promise<void> {
  const images = getData<Image>(STORAGE_KEYS.IMAGES);
  const filteredImages = images.filter((img) => img.id !== id);
  if (filteredImages.length === images.length) {
    throw new Error(`Image ${id} not found`);
  }
  setData(STORAGE_KEYS.IMAGES, filteredImages);
}
