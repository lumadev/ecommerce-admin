import type { ChangeEvent } from "react";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import type { UseImageUploadOptions } from "./imageUpload.types";
import { useImageUploadActions } from "./useImageUploadActions";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const validateImageFile = (file: File, notify: (description: string) => void) => {
  if (!file.type.startsWith("image/")) {
    notify("Selecione um arquivo de imagem válido.");
    return false;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    notify("A imagem deve ter no máximo 5MB.");
    return false;
  }

  return true;
};

export function useImageUpload({
  picturePublicId,
  folder,
  onUpload,
  onRemove,
}: UseImageUploadOptions) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { isUploading, uploadImage, removeImage } = useImageUploadActions({
    picturePublicId,
    folder,
    onUpload,
    onRemove,
    onFinally: resetFileInput,
  });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file, (description) => toast({ description }))) {
      resetFileInput();
      return;
    }

    await uploadImage(file);
  };

  const handleRemoveImage = async () => {
    await removeImage();
  };

  return {
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    openFilePicker,
    isUploading,
  };
}
