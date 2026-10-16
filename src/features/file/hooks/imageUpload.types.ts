export interface UploadResult {
  url: string;
  picturePublicId: string;
}

export interface UseImageUploadOptions {
  picturePublicId?: string;
  folder: "categories" | "products";
  onUpload: (result: UploadResult) => void;
  onRemove: () => void;
}
