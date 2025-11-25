"use client";

import { useCategories } from "@/hooks/useCategories";
import type { Image } from "@/types/image";
import { Brush, Delete, Folder } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import NextImage from "next/image";

interface ImageCardProps {
  image: Image;
  onDelete: (image: Image) => void;
}

export default function ImageCard({ image, onDelete }: ImageCardProps) {
  const { data: categories } = useCategories();

  const getCategoryName = () => {
    const category = categories?.find((c) => c.id === image.categoryId);
    return category?.name || null;
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative", width: "100%", height: 200 }}>
        <NextImage
          src={image.url}
          alt={image.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography variant="h6" component="div">
            {image.name}
          </Typography>
          {getCategoryName() && (
            <Chip
              icon={<Folder />}
              label={getCategoryName()}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Uploaded: {new Date(image.uploadDate).toLocaleDateString()}
        </Typography>
        {image.metadata && (
          <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {image.metadata.size && (
              <Chip label={image.metadata.size} size="small" />
            )}
            {image.metadata.resolution && (
              <Chip label={image.metadata.resolution} size="small" />
            )}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Link
          href={`/images/${image.id}/annotate`}
          style={{ textDecoration: "none", flex: 1 }}
        >
          <Button size="small" fullWidth startIcon={<Brush />}>
            Annotate
          </Button>
        </Link>
        <Button
          size="small"
          color="error"
          startIcon={<Delete />}
          onClick={() => onDelete(image)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
