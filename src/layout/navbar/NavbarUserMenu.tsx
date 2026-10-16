import { UserCircle, Package, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SessionUser } from "@/features/auth/types/auth.types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";

interface NavbarUserMenuProps {
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  user: SessionUser | null;
  onLoginClick: () => void;
}

const NavbarUserMenu = ({
  isAuthenticated,
  isCheckingSession,
  user,
  onLoginClick,
}: NavbarUserMenuProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      ?.filter(Boolean)
      ?.map((n) => n[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase() || "U";

  const accountLabel = isCheckingSession
    ? "Carregando..."
    : isAuthenticated
    ? user?.name ?? "Minha conta"
    : "Entrar";

  if (isCheckingSession) {
    return (
      <button
        disabled
        className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm text-muted-foreground opacity-70"
      >
        <UserCircle size={18} />
        <span className="hidden sm:inline">Carregando...</span>
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={onLoginClick}
        className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        aria-label="Entrar"
      >
        <UserCircle size={18} />
        <span className="hidden sm:inline">Entrar</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground transition-colors hover:border-primary"
          aria-label={accountLabel}
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
              {getInitials(user?.name || user?.email || "U")}
            </AvatarFallback>
          </Avatar>

          <span className="hidden sm:inline max-w-[100px] truncate">
            {user?.name || user?.email}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-foreground">
            {user?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/meus-pedidos")}>
          <Package size={14} className="mr-2" />
          Meus pedidos
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout}>
          <LogOut size={14} className="mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarUserMenu;