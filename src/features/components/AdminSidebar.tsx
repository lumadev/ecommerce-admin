import { LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import {
  adminNavigationItems,
  isNavigationItemAvailableForUser,
  type AdminSection,
} from "@/features/admin-navigation";
import type { SessionUser } from "@/features/auth/types/auth.types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/shared/components/ui/sidebar/sidebar";

import {
  useSidebar,
} from "@/shared/components/ui/sidebar/sidebar-context";
import CurrentUserProfile from "./CurrentUserProfile";

export type { AdminSection } from "@/features/admin-navigation";

const STORE_SPECIFIC_NAVIGATION_ITEMS: Record<
  string,
  readonly AdminSection[]
> = {
  "ecommerce-3d": [],
  "milii-babystore": ["roadmap", "documentacao-api"],
};

const STORE_SPECIFIC_NAVIGATION_KEYS = new Set<AdminSection>(
  Object.values(STORE_SPECIFIC_NAVIGATION_ITEMS).flat(),
);

interface AdminSidebarProps {
  className?: string;
  merchantCode?: string;
}

const getVisibleNavigationItems = (
  user: SessionUser | null,
  merchantCode?: string,
) => {
  const storeSpecificItems =
    STORE_SPECIFIC_NAVIGATION_ITEMS[merchantCode ?? ""] ?? [];

  return adminNavigationItems.filter(({ key }) => {
    if (!isNavigationItemAvailableForUser(key, user)) {
      return false;
    }

    return (
      !STORE_SPECIFIC_NAVIGATION_KEYS.has(key) ||
      storeSpecificItems.includes(key)
    );
  });
};

const AdminSidebar = ({ merchantCode }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { logout, user } = useAdminAuth();

  const closeMobileMenu = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleNavigation = (key: string) => {
    closeMobileMenu();
    navigate(`/${key}`);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate("/login");
  };

  const collapsed = state === "collapsed";
  const visibleNavigationItems = getVisibleNavigationItems(user, merchantCode);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border h-16 justify-start">
        {!collapsed ? (
          <span className="font-display text-lg font-bold tracking-wider text-primary pt-2 pl-2">
            ADMIN
          </span>
        ) : (
          <span className="font-display text-lg font-bold text-primary mx-auto">
            A
          </span>
        )}
      </SidebarHeader>

      <SidebarContent>
        <CurrentUserProfile collapsed={collapsed} />
        <SidebarGroup className={collapsed ? "px-2 pt-4" : "px-3 pt-4 pr-6"}>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={location.pathname.endsWith(item.key)}
                    onClick={() => handleNavigation(item.key)}
                    tooltip={item.title}
                    size="default"
                    className="h-9 text-sm md:pr-20"
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`border-t border-border py-3 ${collapsed ? "px-2" : "px-3 pr-6"}`}>
        <SidebarMenuButton
          onClick={handleLogout}
          tooltip="Sair"
          size="default"
          className="h-9 text-sm text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sair</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
