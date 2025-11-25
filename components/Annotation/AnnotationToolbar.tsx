"use client";

import { Brush, Save } from "@mui/icons-material";
import { Box, Button, Paper, ToggleButton, Typography } from "@mui/material";

interface AnnotationToolbarProps {
  isDrawing: boolean;
  currentColor: string;
  onColorChange: (color: string) => void;
  onDrawingToggle: () => void;
  onSave: () => void;
}

const COLORS = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#000000",
  "#FFFFFF",
];

export default function AnnotationToolbar({
  isDrawing,
  currentColor,
  onColorChange,
  onDrawingToggle,
  onSave,
}: AnnotationToolbarProps) {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Annotation Tools
      </Typography>

      <Box sx={{ mb: 2 }}>
        <ToggleButton
          value="drawing"
          selected={isDrawing}
          onChange={onDrawingToggle}
          fullWidth
        >
          <Brush sx={{ mr: 1 }} />
          {isDrawing ? "Drawing Mode: ON" : "Drawing Mode: OFF"}
        </ToggleButton>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Select Color:
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {COLORS.map((color) => (
          <Box
            key={color}
            onClick={() => onColorChange(color)}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: color,
              border:
                currentColor === color ? "3px solid black" : "1px solid gray",
              cursor: "pointer",
              borderRadius: 1,
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        startIcon={<Save />}
        onClick={onSave}
      >
        Save Annotations
      </Button>
    </Paper>
  );
}
