export interface AnnotationCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Annotation {
  id: number;
  imageId: number;
  type: "rectangle";
  coordinates: AnnotationCoordinates;
  color: string;
}

export interface CreateAnnotationDto {
  imageId: number;
  type: "rectangle";
  coordinates: AnnotationCoordinates;
  color: string;
}

export interface UpdateAnnotationDto
  extends Partial<Omit<CreateAnnotationDto, "imageId">> {}
