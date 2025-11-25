"use client";

import ImageDeleteModal from "@/components/Image/ImageDeleteModal";
import ImageFilters from "@/components/Image/ImageFilters";
import ImageGallery from "@/components/Image/ImageGallery";
import ImageUpload from "@/components/Image/ImageUpload";
import { useDeleteImage, useImages } from "@/hooks/useImages";
import type { Image } from "@/types/image";
import { Add } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useMemo, useState } from "react";

export default function ImagesPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<Image | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    categoryId: undefined as number | undefined,
    metadata: "",
  });

  const { data: images, isLoading, error } = useImages();
  const deleteImage = useDeleteImage();

  const filteredImages = useMemo(() => {
    if (!images) return [];

    return images.filter((image) => {
      const matchesSearch = filters.search
        ? image.name.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchesCategory = filters.categoryId
        ? image.categoryId === filters.categoryId
        : true;

      const matchesMetadata = filters.metadata
        ? JSON.stringify(image.metadata)
            .toLowerCase()
            .includes(filters.metadata.toLowerCase())
        : true;

      return matchesSearch && matchesCategory && matchesMetadata;
    });
  }, [images, filters]);

  const handleDeleteClick = (image: Image) => {
    setImageToDelete(image);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (imageToDelete) {
      deleteImage.mutate(imageToDelete.id);
      setDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Images
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setUploadOpen(true)}
        >
          Upload Image
        </Button>
      </Box>

      <ImageFilters onFilterChange={setFilters} />

      <ImageGallery
        images={filteredImages}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteClick}
      />

      <ImageUpload open={uploadOpen} onClose={() => setUploadOpen(false)} />

      <ImageDeleteModal
        open={deleteModalOpen}
        image={imageToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  );
}
