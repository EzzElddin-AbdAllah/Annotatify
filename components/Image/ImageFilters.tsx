"use client";

import { useCategories } from "@/hooks/useCategories";
import { Clear } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export type ImageFilters = {
  search: string;
  categoryId: number | undefined;
  metadata: string;
};

interface ImageFiltersProps {
  onFilterChange: (filters: ImageFilters) => void;
}

const DEBOUNCE_DELAY = 300;

export default function ImageFilters({ onFilterChange }: ImageFiltersProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [metadata, setMetadata] = useState("");

  const { data: categories } = useCategories();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({ search, categoryId, metadata });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [search, categoryId, metadata, onFilterChange]);

  const handleClear = useCallback(() => {
    setSearch("");
    setCategoryId(undefined);
    setMetadata("");
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    const newCategoryId = value === "" ? undefined : parseInt(value, 10);
    setCategoryId(newCategoryId);
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter image name..."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId !== undefined ? String(categoryId) : ""}
              label="Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Metadata filter"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder="Format, size, etc..."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClear}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
