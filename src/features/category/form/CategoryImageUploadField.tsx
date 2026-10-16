import { ImageOff, Loader2, Upload, X } from "lucide-react";

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
  name: string;
  description: string;
  hashtags: string[];
  onChange: (value: string) => void;
  onUploadComplete?: (data: UploadedImageData) => void;
  onRemove?: () => void;
}

const normalizeHashtag = (tag: string) => {
  const normalized = tag.trim();
  if (!normalized) return "";

  return normalized.replace(/^#+/, "").trim();
};

const CategoryImageUploadField = ({
  label,
  value,
  picturePublicId,
  name,
  description,
  hashtags,
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

  const displayName = name.trim() || "Nova categoria";
  const displayDescription = description.trim() || "Descreva esta categoria para visualizar como ela aparece na vitrine.";

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-sm font-medium">{label}</Label>

      <div className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-card">
        <div className="aspect-[4/3] overflow-hidden">
          {value ? (
            <img
              src={value}
              alt="Pré-visualização da categoria"
              className={`h-full w-full object-cover transition-all duration-500 ${
                isUploading ? "scale-[1.01] opacity-40 blur-[1px]" : "opacity-100"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-card text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <ImageOff className="h-9 w-9" />
                <span className="text-xs">Sem imagem</span>
              </div>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6">
          <h3 className="mb-1 line-clamp-1 font-display text-xl font-bold text-foreground">
            {displayName}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {displayDescription}
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {hashtags.slice(0, 4).map((tag) => {
              const normalizedTag = normalizeHashtag(tag);
              if (!normalizedTag) return null;

              return (
                <span
                  key={`${normalizedTag}-${tag}`}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {normalizedTag}
                </span>
              );
            })}
          </div>
        </div>

        {value && (
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="absolute right-2 top-2 rounded-full bg-background/85 p-1.5 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background"
            aria-label="Remover imagem"
          >
            <X size={14} />
          </button>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/35">
            <div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
              <Loader2 size={14} className="animate-spin" />
              Enviando imagem...
            </div>
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
