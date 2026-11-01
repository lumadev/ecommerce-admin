export type MediaType = "image" | "video";

export interface MediaRecord {
  src: string;
  type: MediaType;
  poster?: string;
  publicId?: string;
  format?: string;
}

export interface MediaInput {
  publicId: string;
  type: MediaType;
  format?: string;
}

export type MediaUploadFolder = "categories" | "products";

export interface UploadMediaResponse {
  url: string;
  public_id: string;
  media_type: MediaType;
  format: string;
  poster?: string;
}
