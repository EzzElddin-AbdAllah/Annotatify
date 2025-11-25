"use client";

import AnnotationList from "@/components/Annotation/AnnotationList";
import AnnotationToolbar from "@/components/Annotation/AnnotationToolbar";
import ImageAnnotationCanvas from "@/components/Annotation/ImageAnnotationCanvas";
import {
  useAnnotations,
  useCreateAnnotation,
  useDeleteAnnotation,
} from "@/hooks/useAnnotations";
import { useImage } from "@/hooks/useImages";
import type { Annotation } from "@/types/annotation";
import { ArrowBack } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

interface AnnotatePageProps {
  params: Promise<{ id: string }>;
}

type AnnotationWithId = Annotation | (Omit<Annotation, "id"> & { id: string });

export default function AnnotatePage({ params }: AnnotatePageProps) {
  const { id: imageIdString } = use(params);
  const imageId = parseInt(imageIdString, 10);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [pendingAnnotations, setPendingAnnotations] = useState<
    Omit<Annotation, "id" | "imageId">[]
  >([]);

  const router = useRouter();

  const {
    data: image,
    isLoading: imageLoading,
    error: imageError,
  } = useImage(imageId);
  const { data: savedAnnotations = [], isLoading: annotationsLoading } =
    useAnnotations(imageId);
  const createAnnotation = useCreateAnnotation();
  const deleteAnnotation = useDeleteAnnotation();

  const handleAnnotationCreate = (
    annotation: Omit<Annotation, "id" | "imageId">
  ) => {
    setPendingAnnotations([...pendingAnnotations, annotation]);
  };

  const handleSave = async () => {
    const savePromises = pendingAnnotations.map((annotation) =>
      createAnnotation.mutateAsync({
        ...annotation,
        imageId,
      })
    );

    try {
      await Promise.all(savePromises);
      setPendingAnnotations([]);
    } catch (error) {
      console.error("Failed to save annotations:", error);
    }
  };

  const handleDelete = (id: number | string) => {
    if (typeof id === "string" && id.startsWith("pending-")) {
      const index = parseInt(id.split("-")[1], 10);
      setPendingAnnotations(pendingAnnotations.filter((_, i) => i !== index));
    } else {
      deleteAnnotation.mutate(id as number);
    }
  };

  if (isNaN(imageId)) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Invalid image ID</Alert>
      </Container>
    );
  }

  if (imageLoading || annotationsLoading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (imageError || !image) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Failed to load image</Alert>
      </Container>
    );
  }

  const allAnnotations: AnnotationWithId[] = [
    ...savedAnnotations,
    ...pendingAnnotations.map((annotation, index) => ({
      ...annotation,
      id: `pending-${index}`,
      imageId,
    })),
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/images")}
        >
          Back to Images
        </Button>
        <Typography variant="h4" component="h1">
          Annotate: {image.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ImageAnnotationCanvas
            imageUrl={image.url}
            annotations={allAnnotations}
            currentColor={currentColor}
            isDrawing={isDrawing}
            onAnnotationCreate={handleAnnotationCreate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AnnotationToolbar
              isDrawing={isDrawing}
              currentColor={currentColor}
              onColorChange={setCurrentColor}
              onDrawingToggle={() => setIsDrawing(!isDrawing)}
              onSave={handleSave}
            />
            <AnnotationList
              annotations={allAnnotations}
              onDelete={handleDelete}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
