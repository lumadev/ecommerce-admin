export interface Category {
  id: string;
  name: string;
  description: string;
  picturePublicId: string;
  url: string;
  hashtags: string[];
}

export interface CreateCategoryData {
  name: string;
  description: string;
  picturePublicId: string;
  hashtags?: string[];
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  picturePublicId?: string;
  hashtags?: string[];
}