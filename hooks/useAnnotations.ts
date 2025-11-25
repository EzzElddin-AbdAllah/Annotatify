import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as annotationsApi from "@/utils/api/annotations";
import type {
  Annotation,
  CreateAnnotationDto,
  UpdateAnnotationDto,
} from "@/types/annotation";

export function useAnnotations(imageId?: number) {
  return useQuery({
    queryKey: imageId ? ["annotations", "image", imageId] : ["annotations"],
    queryFn: () =>
      imageId
        ? annotationsApi.fetchAnnotationsByImageId(imageId)
        : annotationsApi.fetchAnnotations(),
    enabled: !!imageId || imageId === undefined,
  });
}

export function useCreateAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnotationDto) =>
      annotationsApi.createAnnotation(data),
    onSuccess: (newAnnotation) => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
      queryClient.invalidateQueries({
        queryKey: ["annotations", "image", newAnnotation.imageId],
      });
    },
  });
}

export function useUpdateAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnotationDto }) =>
      annotationsApi.updateAnnotation(id, data),
    onSuccess: (updatedAnnotation) => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
      queryClient.invalidateQueries({
        queryKey: ["annotations", "image", updatedAnnotation.imageId],
      });
    },
  });
}

export function useDeleteAnnotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => annotationsApi.deleteAnnotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
    },
  });
}
