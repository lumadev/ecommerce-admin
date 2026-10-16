import { Search } from "lucide-react";

const NavbarSearch = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      aria-label="Buscar"
    >
      <Search size={16} />
      <span className="hidden sm:inline">Buscar...</span>
    </button>
  );
};

export default NavbarSearch;