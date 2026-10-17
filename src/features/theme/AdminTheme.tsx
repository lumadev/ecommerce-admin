import { useLayoutEffect, type ReactNode } from "react";

import { getAdminThemeCssVariables } from "./adminThemeVars";

interface AdminThemeProps {
  merchantId?: string | null;
  children: ReactNode;
}

export const AdminTheme = ({ merchantId, children }: AdminThemeProps) => {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const variables = getAdminThemeCssVariables(merchantId);
    const previousValues = new Map<string, string>();

    for (const [name, value] of Object.entries(variables)) {
      previousValues.set(name, root.style.getPropertyValue(name));
      root.style.setProperty(name, value);
    }

    return () => {
      for (const [name, value] of previousValues) {
        if (value) {
          root.style.setProperty(name, value);
        } else {
          root.style.removeProperty(name);
        }
      }
    };
  }, [merchantId]);

  return <>{children}</>;
};

export default AdminTheme;