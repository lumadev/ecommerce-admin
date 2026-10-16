import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { imageUploadRepository } from "../repositories/imageUploadRepository";
import type { UseImageUploadOptions } from "./imageUpload.types";

interface UseImageUploadActionsOptions extends UseImageUploadOptions {
  onFinally?: () => void;
}

export function useImageUploadActions({
  picturePublicId,
  folder,
  onUpload,
  onRemove,
  onFinally,
}: UseImageUploadActionsOptions) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setIsUploading(true);

    try {
      const result = await imageUploadRepository.upload(file, folder);
      onUpload({
        url: result.url,
        picturePublicId: result.public_id,
      });

      toast({ variant: "success", description: "Imagem enviada com sucesso." });
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
        await imageUploadRepository.delete(picturePublicId);
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
