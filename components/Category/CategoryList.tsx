"use client";

import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import type { Category } from "@/types/category";
import { Delete, Edit } from "@mui/icons-material";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CategoryDeleteModal from "./CategoryDeleteModal";

interface CategoryListProps {
  onEdit: (category: Category) => void;
}

export default function CategoryList({ onEdit }: CategoryListProps) {
  const { data: categories, isLoading, error } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory.mutate(categoryToDelete.id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Failed to load categories. {error.message}</Alert>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No categories found. Create your first category to get started.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => onEdit(category)}
                    color="primary"
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(category)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryDeleteModal
        open={deleteModalOpen}
        category={categoryToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
