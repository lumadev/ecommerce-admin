import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Merchant } from "@/features/admin/merchant/types/merchant.types";

interface StoreSelectProps {
  selectedMerchant: Merchant | null;
  merchantList: Merchant[];
  isLoading: boolean;
  onChange: (merchant: Merchant) => void;
}

export const StoreSelect = ({
  selectedMerchant,
  merchantList,
  isLoading,
  onChange,
}: StoreSelectProps) => {
  const handleChange = (merchantId: string) => {
    const merchant = merchantList.find((item) => item.id === merchantId);
    if (merchant) {
      onChange(merchant);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="hidden text-[10px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
        Loja
      </span>
      <Select
        value={selectedMerchant?.id}
        onValueChange={handleChange}
        disabled={isLoading}
      >
        <SelectTrigger className="h-9 w-40 sm:w-56">
          <SelectValue placeholder={isLoading ? "Carregando lojas..." : "Selecionar loja"} />
        </SelectTrigger>
        <SelectContent>
          {merchantList.map((merchant) => (
            <SelectItem key={merchant.id} value={merchant.id}>
              {merchant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};