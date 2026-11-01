import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mediaUploadRepository } from "@/infra/media/mediaUploadRepository";
import type { UseCategoryImageUploadOptions } from "./categoryImageUpload.types";

interface UseCategoryImageUploadActionsOptions extends UseCategoryImageUploadOptions {
  onFinally?: () => void;
}

export function useCategoryImageUploadActions({
  picturePublicId,
  onUpload,
  onRemove,
  onFinally,
}: UseCategoryImageUploadActionsOptions) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      const result = await mediaUploadRepository.upload(file, "categories");
      onUpload({
        url: result.url,
        picturePublicId: result.public_id,
      });
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      toast({ description: "Não foi possível enviar a imagem. Tente novamente." });
    } finally {
      setIsUploading(false);
      onFinally?.();
    }
  };

  const removeImage = async () => {
    setIsUploading(true);

    try {
      if (picturePublicId) {
        await mediaUploadRepository.delete(picturePublicId, "image", "categories");
      }

      onRemove();
      toast({ variant: "success", description: "Imagem removida com sucesso." });
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      toast({ description: "Não foi possível remover a imagem. Tente novamente." });
    } finally {
      setIsUploading(false);
      onFinally?.();
    }
  };

  return {
    isUploading,
    uploadImage,
    removeImage,
  };
}
