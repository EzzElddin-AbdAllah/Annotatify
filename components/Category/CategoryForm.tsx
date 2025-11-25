"use client";

import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import type { Category, CreateCategoryDto } from "@/types/category";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface CategoryFormProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

export default function CategoryForm({
  open,
  category,
  onClose,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [category, open]);

  const handleSubmit = async () => {
    const data: CreateCategoryDto = {
      name,
      description: description || undefined,
    };

    if (category) {
      updateCategory.mutate(
        { id: category.id, data },
        {
          onSuccess: () => {
            onClose();
            setName("");
            setDescription("");
          },
        }
      );
    } else {
      createCategory.mutate(data, {
        onSuccess: () => {
          onClose();
          setName("");
          setDescription("");
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {category ? "Edit Category" : "Create Category"}
      </DialogTitle>
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
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
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
            !name.trim() || createCategory.isPending || updateCategory.isPending
          }
        >
          {category ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
