import { LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/features/auth/hooks/useAdminAuth";
import { adminNavigationItems } from "@/features//admin-navigation";
import { useVariants } from "@/features/variant/hooks/useVariants";
import CurrentUserProfile from "./CurrentUserProfile";
export type { AdminSection } from "@/features//admin-navigation";
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

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar = (_props: AdminSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { state } = useSidebar();
  const { logout, user } = useAdminAuth();
  const { variants } = useVariants();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const collapsed = state === "collapsed";

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
              {adminNavigationItems
                .filter(
                  (item) =>
                    (item.key !== "lojas" || user?.role === "SUPER_ADMIN") &&
                    (item.key !== "variantes" || variants.length > 0)
                )
                .map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={location.pathname.endsWith(item.key)}
                    onClick={() => navigate(`/${item.key}`)}
                    tooltip={item.title}
                    size="default"
                    className="h-9 text-sm md:pr-30"
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
