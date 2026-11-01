import { ImagePlus, Loader2, Upload, X } from "lucide-react";

import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button/button";
import { useCategoryImageUpload } from "./hooks/useCategoryImageUpload";

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
  } = useCategoryImageUpload(uploadConfig);

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-muted/50">
        {value ? (
          <>
            <img
              src={value}
              alt="Foto da categoria"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="absolute right-2 top-2 rounded-full bg-background/90 p-2 text-foreground shadow-sm transition-colors hover:bg-background disabled:opacity-50"
              aria-label="Remover imagem"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-muted-foreground">
            <ImagePlus size={36} strokeWidth={1.5} />
            <span className="text-sm font-medium text-foreground">Prévia da foto</span>
            <span className="text-xs">Selecione uma imagem para destacar esta categoria.</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/75 text-sm text-foreground">
            <Loader2 size={16} className="animate-spin" />
            Enviando imagem...
          </div>
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
        className="w-full max-w-[320px] gap-2"
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

      <p className="max-w-[320px] text-center text-xs text-muted-foreground">PNG ou JPG, até 5MB.</p>
    </div>
  );
};

export default CategoryImageUploadField;
