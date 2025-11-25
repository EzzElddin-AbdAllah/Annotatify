'use client';

import type { Image } from '@/types/image';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface ImageDeleteModalProps {
  open: boolean;
  image: Image | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ImageDeleteModal({ open, image, onClose, onConfirm }: ImageDeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Image</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{image?.name}</strong>?
          This action cannot be undone.
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
