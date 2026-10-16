import { ShoppingCart } from "lucide-react";

const NavbarShoppingBtn = ({ onOpen, totalItems = 0 }) => {
  return (
    <button
      onClick={onOpen}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      aria-label="Carrinho"
    >
      <ShoppingCart size={18} />

      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default NavbarShoppingBtn;