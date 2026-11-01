export interface CategoryImageUploadResult {
  url: string;
  picturePublicId: string;
}

export interface UseCategoryImageUploadOptions {
  picturePublicId?: string;
  onUpload: (result: CategoryImageUploadResult) => void;
  onRemove: () => void;
}
