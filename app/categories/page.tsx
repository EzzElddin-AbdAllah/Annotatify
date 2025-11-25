"use client";

import CategoryForm from "@/components/Category/CategoryForm";
import CategoryList from "@/components/Category/CategoryList";
import type { Category } from "@/types/category";
import { Add } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useState } from "react";

export default function CategoriesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Categories
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreate}>
          Add Category
        </Button>
      </Box>

      <CategoryList onEdit={handleEdit} />

      <CategoryForm
        open={formOpen}
        category={selectedCategory}
        onClose={handleClose}
      />
    </Container>
  );
}
