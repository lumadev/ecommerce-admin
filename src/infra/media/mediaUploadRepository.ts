import { httpClientAuth } from "@/infra/http/httpClient";
import type {
  MediaType,
  MediaUploadFolder,
  UploadMediaResponse,
} from "./media.types";

export const mediaUploadRepository = {
  upload: async (
    file: File,
    folder: MediaUploadFolder,
    mediaType: MediaType = "image",
  ): Promise<UploadMediaResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("mediaType", mediaType);

    const response = await httpClientAuth.post<UploadMediaResponse>(
      "/upload",
      formData,
      { timeout: 300_000 },
    );

    return response.data;
  },
  delete: async (
    publicId: string,
    mediaType: MediaType = "image",
    folder: MediaUploadFolder = "products",
    merchantCode?: string,
  ): Promise<void> => {
    const response = await httpClientAuth.delete<{ result: string }>("/upload", {
      data: {
        public_id: publicId,
        media_type: mediaType,
        folder,
        merchantCode,
      },
    });
    if (response.data.result === "error") {
      throw new Error(`Could not delete ${mediaType} media ${publicId}.`);
    }
  },
};
