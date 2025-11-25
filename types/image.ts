export interface ImageMetadata {
  size: string;
  resolution: string;
}

export interface Image {
  id: number;
  name: string;
  url: string;
  categoryId: number;
  uploadDate: string;
  metadata: ImageMetadata;
}

export interface CreateImageDto {
  name: string;
  url: string;
  categoryId: number;
  metadata?: ImageMetadata;
}

export interface UpdateImageDto extends Partial<CreateImageDto> {}
