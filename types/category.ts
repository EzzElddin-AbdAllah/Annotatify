export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
