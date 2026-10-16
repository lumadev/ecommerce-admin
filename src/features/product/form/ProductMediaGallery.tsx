import { useRef, useState, type ChangeEvent } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Play, Trash2, Video } from "lucide-react";
import { Button } from "@/shared/components/ui/button/button";
import { useToast } from "@/hooks/use-toast";
import type { ProductFormMedia } from "../types/product-form.types";
import { mediaUploadRepository } from "@/features/file/repositories/imageUploadRepository";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;
const MAX_VIDEO_DURATION_SECONDS = 60;

interface Props {
  value: ProductFormMedia[];
  onChange: (media: ProductFormMedia[]) => void;
  onUploadingChange: (isUploading: boolean) => void;
  error?: string;
}

const getVideoDuration = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute("src");
    };

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = video.duration;
      cleanup();
      resolve(duration);
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("Não foi possível ler a duração do vídeo."));
    };
    video.src = objectUrl;
  });

const ProductMediaGallery = ({ value, onChange, onUploadingChange, error }: Props) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [removingPublicId, setRemovingPublicId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState("");

  const validateFile = async (file: File) => {
    if (file.type.startsWith("image/")) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast({ description: "Cada imagem deve ter no máximo 5 MB." });
        return false;
      }
      return true;
    }

    if (file.type.startsWith("video/")) {
      if (file.size > MAX_VIDEO_SIZE_BYTES) {
        toast({ description: "Cada vídeo deve ter no máximo 100 MB." });
        return false;
      }

      try {
        const duration = await getVideoDuration(file);
        if (!Number.isFinite(duration) || duration > MAX_VIDEO_DURATION_SECONDS) {
          toast({ description: "Cada vídeo deve ter no máximo 60 segundos." });
          return false;
        }
      } catch (error) {
        console.error("Erro ao verificar a duração do vídeo:", error);
        toast({ description: "Não foi possível verificar a duração do vídeo." });
        return false;
      }

      return true;
    }

    toast({ description: "Selecione arquivos de imagem ou vídeo válidos." });
    return false;
  };

  const handleFilesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    if (removingPublicId) return;
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    let nextMedia = value;
    setIsUploading(true);
    onUploadingChange(true);

    try {
      for (const [index, file] of files.entries()) {
        setUploadProgress(`Enviando ${index + 1} de ${files.length}...`);
        if (!(await validateFile(file))) continue;

        const type = file.type.startsWith("video/") ? "video" : "image";

        try {
          const uploaded = await mediaUploadRepository.upload(
            file,
            "products",
            type,
          );
          nextMedia = [
            ...nextMedia,
            {
              src: uploaded.url,
              poster: uploaded.poster,
              publicId: uploaded.public_id,
              type: uploaded.media_type,
              format: uploaded.format,
              persisted: false,
            },
          ];
          onChange(nextMedia);
          toast({
            variant: "success",
            description: type === "video"
              ? "Vídeo enviado com sucesso."
              : "Imagem enviada com sucesso.",
          });
        } catch (error) {
          console.error("Erro ao enviar mídia do produto:", error);
          toast({
            description: `Não foi possível enviar "${file.name}". Tente novamente.`,
          });
        }
      }
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      onUploadingChange(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (media: ProductFormMedia) => {
    if (isUploading || removingPublicId) return;
    setRemovingPublicId(media.publicId);
    onUploadingChange(true);
    try {
      if (!media.persisted) {
        await mediaUploadRepository.delete(media.publicId, media.type);
      }

      onChange(value.filter((item) => item.publicId !== media.publicId));
    } catch (error) {
      console.error("Erro ao remover mídia temporária do produto:", error);
      toast({ description: "Não foi possível remover esta mídia. Tente novamente." });
    } finally {
      setRemovingPublicId(null);
      onUploadingChange(false);
    }
  };

  const moveMedia = (index: number, offset: -1 | 1) => {
    const destination = index + offset;
    if (destination < 0 || destination >= value.length) return;

    const reordered = [...value];
    [reordered[index], reordered[destination]] = [
      reordered[destination],
      reordered[index],
    ];
    onChange(reordered);
  };

  return (
    <section
      className="grid gap-4"
      role="group"
      aria-labelledby="product-media-heading"
      aria-describedby={error ? "product-media-error" : undefined}
      aria-invalid={error ? true : undefined}
    >
      <div>
        <h3 id="product-media-heading" className="font-medium">
          Fotos e vídeos do produto
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A primeira mídia será a capa. Reordene os itens para definir como aparecem na vitrine.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(event) => void handleFilesSelected(event)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !!removingPublicId}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {isUploading ? uploadProgress : "Adicionar fotos ou vídeos"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Imagens: até 5 MB. Vídeos: até 100 MB e 60 segundos.
        </span>
      </div>

      {error && (
        <p id="product-media-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {value.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground">
          <ImagePlus className="h-8 w-8" />
          <span>Nenhuma mídia adicionada.</span>
        </div>
      ) : (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((media, index) => (
            <li
              key={media.publicId}
              className="overflow-hidden rounded-lg border border-border bg-background"
            >
              <div className="relative aspect-square bg-muted">
                {media.type === "image" ? (
                  <img
                    src={media.src}
                    alt={`Mídia ${index + 1} do produto`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    {media.poster ? (
                      <img
                        src={media.poster}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.src}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play className="h-8 w-8 fill-white text-white" />
                    </span>
                  </>
                )}
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                    Capa
                  </span>
                )}
                <span className="absolute bottom-2 right-2 rounded-full bg-background/90 p-1.5 text-foreground">
                  {media.type === "video" ? (
                    <Video className="h-4 w-4" aria-label="Vídeo" />
                  ) : (
                    <ImagePlus className="h-4 w-4" aria-label="Imagem" />
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 p-2">
                <span className="truncate text-xs text-muted-foreground">
                  {media.type === "video" ? "Vídeo" : "Foto"} {index + 1}
                </span>
                <div className="flex shrink-0 items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Mover mídia ${index + 1} para cima`}
                    disabled={isUploading || !!removingPublicId || index === 0}
                    onClick={() => moveMedia(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Mover mídia ${index + 1} para baixo`}
                    disabled={isUploading || !!removingPublicId || index === value.length - 1}
                    onClick={() => moveMedia(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    aria-label={`Remover mídia ${index + 1}`}
                    disabled={isUploading || !!removingPublicId}
                    onClick={() => void handleRemove(media)}
                  >
                    {removingPublicId === media.publicId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default ProductMediaGallery;
