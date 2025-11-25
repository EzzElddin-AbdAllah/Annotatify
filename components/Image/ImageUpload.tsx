"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useCreateImage } from "@/hooks/useImages";
import { useCategories } from "@/hooks/useCategories";
import type { CreateImageDto } from "@/types/image";
import { useState } from "react";

interface ImageUploadProps {
  open: boolean;
  onClose: () => void;
}

export default function ImageUpload({ open, onClose }: ImageUploadProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [format, setFormat] = useState("");
  const [resolution, setResolution] = useState("");
  const [size, setSize] = useState<string>("");

  const createImage = useCreateImage();
  const { data: categories } = useCategories();

  const handleSubmit = async () => {
    if (categoryId === "") return;

    const data: CreateImageDto = {
      name,
      url,
      categoryId,
      metadata: {
        resolution: resolution || "0x0",
        size: size || "0MB",
      },
    };

    createImage.mutate(data, {
      onSuccess: () => {
        onClose();
        setName("");
        setUrl("");
        setCategoryId("");
        setFormat("");
        setResolution("");
        setSize("");
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Image</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            fullWidth
            placeholder="https://example.com/image.jpg"
          />
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId === "" ? "" : String(categoryId)}
              label="Category"
              onChange={(e) =>
                setCategoryId(
                  e.target.value === "" ? "" : parseInt(e.target.value, 10)
                )
              }
            >
              {categories?.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Format (optional)"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            fullWidth
            placeholder="JPEG, PNG, etc."
          />
          <TextField
            label="Resolution (optional)"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            fullWidth
            placeholder="1920x1080"
          />
          <TextField
            label="Size in KB (optional)"
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !name.trim() || !url.trim() || !categoryId || createImage.isPending
          }
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
