"use client";

import type { Annotation } from "@/types/annotation";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

interface AnnotationListProps {
  annotations: (Annotation | (Omit<Annotation, "id"> & { id: string }))[];
  onDelete: (id: number | string) => void;
}

export default function AnnotationList({
  annotations,
  onDelete,
}: AnnotationListProps) {
  if (annotations.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Annotations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No annotations yet. Enable drawing mode and draw rectangles on the
          image.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Annotations ({annotations.length})
      </Typography>
      <List dense>
        {annotations.map((annotation, index) => (
          <ListItem
            key={annotation.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => onDelete(annotation.id)}
                color="error"
              >
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    size="small"
                    label={`#${index + 1}`}
                    sx={{ backgroundColor: annotation.color, color: "white" }}
                  />
                  <Typography variant="body2">
                    Rectangle at ({Math.round(annotation.coordinates.x)},{" "}
                    {Math.round(annotation.coordinates.y)})
                  </Typography>
                </Box>
              }
              secondary={`Size: ${Math.round(
                Math.abs(annotation.coordinates.width)
              )} x ${Math.round(Math.abs(annotation.coordinates.height))}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
