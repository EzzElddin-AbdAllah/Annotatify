import type { CreateImageDto, UpdateImageDto } from "@/types/image";
import * as imagesApi from "@/utils/api/images";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useImages() {
  return useQuery({
    queryKey: ["images"],
    queryFn: imagesApi.fetchImages,
  });
}

export function useImage(id: number) {
  return useQuery({
    queryKey: ["images", id],
    queryFn: () => imagesApi.fetchImageById(id),
    enabled: !!id,
  });
}

export function useCreateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateImageDto) => imagesApi.createImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
}

export function useUpdateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateImageDto }) =>
      imagesApi.updateImage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
      queryClient.invalidateQueries({ queryKey: ["images", variables.id] });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => imagesApi.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });
}
