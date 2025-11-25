import type {
  Annotation,
  CreateAnnotationDto,
  UpdateAnnotationDto,
} from "@/types/annotation";
import {
  STORAGE_KEYS,
  getData,
  setData,
  initializeData,
} from "@/utils/storage";

export async function fetchAnnotations(): Promise<Annotation[]> {
  return initializeData<Annotation>(STORAGE_KEYS.ANNOTATIONS);
}

export async function fetchAnnotationsByImageId(
  imageId: number
): Promise<Annotation[]> {
  await initializeData<Annotation>(STORAGE_KEYS.ANNOTATIONS);

  const annotations = getData<Annotation>(STORAGE_KEYS.ANNOTATIONS);
  return annotations.filter((ann) => ann.imageId === imageId);
}

export async function createAnnotation(
  data: CreateAnnotationDto
): Promise<Annotation> {
  const annotations = getData<Annotation>(STORAGE_KEYS.ANNOTATIONS);

  const maxId =
    annotations.length > 0 ? Math.max(...annotations.map((a) => a.id)) : 0;

  const newAnnotation: Annotation = {
    ...data,
    id: maxId + 1,
  };
  setData(STORAGE_KEYS.ANNOTATIONS, [...annotations, newAnnotation]);
  return newAnnotation;
}

export async function updateAnnotation(
  id: number,
  data: UpdateAnnotationDto
): Promise<Annotation> {
  const annotations = getData<Annotation>(STORAGE_KEYS.ANNOTATIONS);
  const index = annotations.findIndex((ann) => ann.id === id);
  if (index === -1) {
    throw new Error(`Annotation ${id} not found`);
  }

  const updatedAnnotation = { ...annotations[index], ...data };
  annotations[index] = updatedAnnotation;
  setData(STORAGE_KEYS.ANNOTATIONS, annotations);
  return updatedAnnotation;
}

export async function deleteAnnotation(id: number): Promise<void> {
  const annotations = getData<Annotation>(STORAGE_KEYS.ANNOTATIONS);
  const filteredAnnotations = annotations.filter((ann) => ann.id !== id);
  if (filteredAnnotations.length === annotations.length) {
    throw new Error(`Annotation ${id} not found`);
  }
  setData(STORAGE_KEYS.ANNOTATIONS, filteredAnnotations);
}
