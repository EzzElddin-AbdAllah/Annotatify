"use client";

import type { Image } from "@/types/image";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import * as ReactWindow from "react-window";
import ImageCard from "./ImageCard";

const Grid = ReactWindow.Grid as any;

const CELL_HEIGHT = 380;
const GUTTER = 16;
const MAX_GRID_HEIGHT = 800;

const BREAKPOINTS = {
  TABLET: 768,
  LAPTOP: 1024,
  DESKTOP: 1440,
} as const;

interface ImageGalleryProps {
  images: Image[];
  isLoading: boolean;
  error: Error | null;
  onDelete: (image: Image) => void;
}

interface CellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  images: Image[];
  onDelete: (image: Image) => void;
  cellWidth: number;
  cellHeight: number;
  gutter: number;
  columnCount: number;
}

const parseStyleValue = (value: string | number | undefined): number => {
  if (typeof value === "string") return parseFloat(value);
  return value ?? 0;
};

const Cell = ({
  columnIndex,
  rowIndex,
  style,
  images,
  onDelete,
  cellWidth,
  cellHeight,
  gutter,
  columnCount,
}: CellProps) => {
  const index = rowIndex * columnCount + columnIndex;

  const cellStyle: React.CSSProperties = {
    ...style,
    left: parseStyleValue(style.left) + columnIndex * gutter,
    top: parseStyleValue(style.top) + rowIndex * gutter,
    width: cellWidth,
    height: cellHeight,
  };

  if (index >= images.length) {
    return <div style={cellStyle} />;
  }

  const image = images[index];

  return (
    <div style={cellStyle}>
      <ImageCard image={image} onDelete={onDelete} />
    </div>
  );
};

const getColumnCount = (width: number): number => {
  if (width < BREAKPOINTS.TABLET) return 1;
  if (width < BREAKPOINTS.LAPTOP) return 2;
  if (width < BREAKPOINTS.DESKTOP) return 3;
  return 4;
};

export default function ImageGallery({
  images,
  isLoading,
  error,
  onDelete,
}: ImageGalleryProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [columnCount, setColumnCount] = useState(2);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const width = node.getBoundingClientRect().width;
      if (width > 0) {
        setContainerWidth(width);
        setColumnCount(getColumnCount(width));
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = entry.contentRect.width;
          if (w > 0) {
            setContainerWidth(w);
            setColumnCount(getColumnCount(w));
          }
        }
      });

      observer.observe(node);
      resizeObserverRef.current = observer;
    } else {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    }
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Failed to load images. {error.message}</Alert>
    );
  }

  if (!images?.length) {
    return (
      <Typography variant="body1" color="text.secondary">
        No images found. Upload your first image to get started.
      </Typography>
    );
  }

  const rowCount = Math.ceil(images.length / columnCount);
  const effectiveWidth =
    containerWidth ||
    (typeof window !== "undefined" ? window.innerWidth - 100 : 1200);

  const availableWidth = effectiveWidth - 2;
  const cellWidth = Math.floor(
    (availableWidth - (columnCount - 1) * GUTTER) / columnCount
  );
  const cellHeight = CELL_HEIGHT;

  const gridWidth = Math.min(
    availableWidth,
    columnCount * cellWidth + (columnCount - 1) * GUTTER
  );
  const gridHeight = rowCount * cellHeight + (rowCount - 1) * GUTTER;

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: Math.min(gridHeight, MAX_GRID_HEIGHT),
        overflow: "auto",
        overflowX: "hidden",
      }}
    >
      <Grid
        columnCount={columnCount}
        columnWidth={cellWidth - GUTTER / 2}
        height={Math.min(gridHeight, MAX_GRID_HEIGHT)}
        rowCount={rowCount}
        rowHeight={cellHeight}
        width={gridWidth}
        cellComponent={Cell}
        cellProps={{
          images,
          onDelete,
          cellWidth,
          cellHeight,
          gutter: GUTTER,
          columnCount,
        }}
      />
    </Box>
  );
}
