import { Loader2, Upload, X } from "lucide-react";

import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button/button";
import { useImageUpload } from "@/features/file/hooks/useImageUpload";

interface UploadedImageData {
  url: string;
  picturePublicId: string;
}

interface Props {
  label: string;
  value: string;
  picturePublicId?: string;
  onChange: (value: string) => void;
  onUploadComplete?: (data: UploadedImageData) => void;
  onRemove?: () => void;
}

const CategoryImageUploadField = ({
  label,
  value,
  picturePublicId,
  onChange,
  onUploadComplete,
  onRemove,
}: Props) => {
  const uploadConfig = {
    picturePublicId,
    folder: "categories" as const,

    onUpload: (data: UploadedImageData) => {
      onChange(data.url);
      onUploadComplete?.(data);
    },

    onRemove: () => {
      onChange("");
      onRemove?.();
    },
  };

  const {
    fileInputRef,
    handleImageChange,
    handleRemoveImage,
    openFilePicker,
    isUploading,
  } = useImageUpload(uploadConfig);

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="flex flex-wrap items-center gap-3">
        {value && (
          <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border">
            <img
              src={value}
              alt="Foto da categoria"
              className={`h-full w-full object-cover ${isUploading ? "opacity-40" : ""}`}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="absolute right-1 top-1 rounded-full bg-background/85 p-1 text-foreground shadow-sm transition-colors hover:bg-background"
              aria-label="Remover imagem"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {isUploading && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            Enviando imagem...
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={openFilePicker}
        disabled={isUploading}
      >
        <Upload size={14} />
        {isUploading
          ? "Enviando..."
          : value
            ? "Trocar foto"
            : "Enviar foto"}
      </Button>

      <p className="text-xs text-muted-foreground">PNG ou JPG, até 5MB.</p>
    </div>
  );
};

export default CategoryImageUploadField;
