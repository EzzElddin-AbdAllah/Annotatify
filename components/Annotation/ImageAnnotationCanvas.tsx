"use client";

import type { Annotation } from "@/types/annotation";
import { Paper } from "@mui/material";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect, Stage } from "react-konva";

const STROKE_WIDTH = 3;
const MIN_ANNOTATION_SIZE = 5;
const MAX_HEIGHT_VIEWPORT_RATIO = 0.85;

type AnnotationDraft = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface ImageAnnotationCanvasProps {
  imageUrl: string;
  annotations: (Annotation | (Omit<Annotation, "id"> & { id: string }))[];
  currentColor: string;
  isDrawing: boolean;
  onAnnotationCreate: (annotation: Omit<Annotation, "id" | "imageId">) => void;
}

export default function ImageAnnotationCanvas({
  imageUrl,
  annotations,
  currentColor,
  isDrawing,
  onAnnotationCreate,
}: ImageAnnotationCanvasProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [newAnnotation, setNewAnnotation] = useState<AnnotationDraft | null>(
    null
  );
  const [scale, setScale] = useState(1);
  const [stageDimensions, setStageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => setImage(img);
  }, [imageUrl]);

  useEffect(() => {
    if (!containerRef.current || !image) return;

    const updateDimensions = () => {
      const containerWidth = containerRef.current?.offsetWidth || 0;

      if (containerWidth > 0 && image.width > 0) {
        let newScale = containerWidth / image.width;

        const maxHeight = window.innerHeight * MAX_HEIGHT_VIEWPORT_RATIO;
        if (image.height * newScale > maxHeight) {
          newScale = maxHeight / image.height;
        }

        setScale(newScale);
        setStageDimensions({
          width: image.width * newScale,
          height: image.height * newScale,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [image]);

  const getPointerPosition = () => {
    const stage = stageRef.current;
    if (!stage) return null;

    const pos = stage.getPointerPosition();
    if (!pos) return null;

    return {
      x: pos.x / scale,
      y: pos.y / scale,
    };
  };

  const handleMouseDown = () => {
    if (!isDrawing) return;
    const pos = getPointerPosition();
    if (!pos) return;

    setNewAnnotation({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = () => {
    if (!isDrawing || !newAnnotation) return;
    const pos = getPointerPosition();
    if (!pos) return;

    setNewAnnotation({
      ...newAnnotation,
      width: pos.x - newAnnotation.x,
      height: pos.y - newAnnotation.y,
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !newAnnotation) return;

    const minSize = MIN_ANNOTATION_SIZE / scale;
    if (
      Math.abs(newAnnotation.width) > minSize &&
      Math.abs(newAnnotation.height) > minSize
    ) {
      onAnnotationCreate({
        type: "rectangle",
        coordinates: {
          x: newAnnotation.x,
          y: newAnnotation.y,
          width: newAnnotation.width,
          height: newAnnotation.height,
        },
        color: currentColor,
      });
    }
    setNewAnnotation(null);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <div
        ref={containerRef}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        {image && (
          <Stage
            ref={stageRef}
            width={stageDimensions.width}
            height={stageDimensions.height}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              <KonvaImage
                image={image}
                width={image.width}
                height={image.height}
              />
              {annotations.map((annotation) => (
                <Rect
                  key={annotation.id}
                  x={annotation.coordinates.x}
                  y={annotation.coordinates.y}
                  width={annotation.coordinates.width}
                  height={annotation.coordinates.height}
                  stroke={annotation.color}
                  strokeWidth={STROKE_WIDTH / scale}
                />
              ))}
              {newAnnotation && (
                <Rect
                  x={newAnnotation.x}
                  y={newAnnotation.y}
                  width={newAnnotation.width}
                  height={newAnnotation.height}
                  stroke={currentColor}
                  strokeWidth={STROKE_WIDTH / scale}
                />
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </Paper>
  );
}
