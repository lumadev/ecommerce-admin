import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { productRepository } from "@/features/product/repositories/productRepository";
import { ProductListItem } from "@/features/product/types/product.types";

interface Props {
  open: boolean;
  onClose: () => void;
  excludedProductIds: string[];
  onLink: (productId: string) => Promise<unknown>;
}

const AddHighlightDialog = ({ open, onClose, excludedProductIds, onLink }: Props) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [linkingId, setLinkingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const all = await productRepository.findAll(controller.signal);
        setProducts(all);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

        toast({ description: "Não foi possível carregar os produtos." });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, [open, toast]);

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const availableProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products
      .filter((product) => !excludedProductIds.includes(product.id))
      .filter((product) => product.name.toLowerCase().includes(term));
  }, [products, excludedProductIds, search]);

  const handleLink = async (productId: string) => {
    try {
      setLinkingId(productId);
      await onLink(productId);
      onClose();
    } catch {
      // erro já tratado e exibido no hook responsável pela chamada
    } finally {
      setLinkingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card text-card-foreground sm:max-w-[640px]">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl">Adicionar produto em destaque</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Selecione um produto para vincular à área de destaque.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produto pelo nome..."
            className="pl-9"
          />
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}

          {!isLoading && availableProducts.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nenhum produto disponível para destacar.
            </p>
          )}

          {!isLoading &&
            availableProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {product.media?.[0]?.type === "video" ? (
                    <img
                      src={product.media[0].poster ?? product.mediaUrls[0]}
                      alt={product.name}
                      className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
                    />
                  ) : product.mediaUrls?.[0] ? (
                    <img
                      src={product.media?.[0]?.src ?? product.mediaUrls[0]}
                      alt={product.name}
                      className="h-12 w-12 shrink-0 rounded-md border border-border object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 shrink-0 rounded-md border border-border bg-muted" />
                  )}
                  <span className="truncate text-sm font-medium">
                    {product.name}
                  </span>
                </div>

                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={() => void handleLink(product.id)}
                  disabled={linkingId === product.id}
                >
                  {linkingId === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Vincular"
                  )}
                </Button>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHighlightDialog;
