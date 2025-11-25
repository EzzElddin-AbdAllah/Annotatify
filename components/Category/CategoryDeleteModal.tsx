"use client";

import type { Category } from "@/types/category";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface CategoryDeleteModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CategoryDeleteModal({
  open,
  category,
  onClose,
  onConfirm,
}: CategoryDeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the category{" "}
          <strong>{category?.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
