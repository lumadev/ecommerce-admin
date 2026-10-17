export interface AdminThemeTokens {
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  sidebarBackground?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
}

const defineTheme = (tokens: AdminThemeTokens): AdminThemeTokens => tokens;

export const ADMIN_THEMES = {
  default: defineTheme({}),
};

export type AdminThemeName = keyof typeof ADMIN_THEMES;

export const ADMIN_THEME_BY_MERCHANT_ID: Record<string, AdminThemeName> = {};

const CSS_VARIABLE_BY_TOKEN: Record<keyof AdminThemeTokens, `--${string}`> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  sidebarBackground: "--sidebar-background",
  sidebarForeground: "--sidebar-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarAccent: "--sidebar-accent",
  sidebarAccentForeground: "--sidebar-accent-foreground",
  sidebarBorder: "--sidebar-border",
  sidebarRing: "--sidebar-ring",
};

export const getAdminThemeCssVariables = (
  merchantId?: string | null,
): Record<string, string> => {
  const themeName = merchantId
    ? ADMIN_THEME_BY_MERCHANT_ID[merchantId]
    : undefined;
  const theme = ADMIN_THEMES[themeName ?? "default"];
  const variables: Record<string, string> = {};

  for (const token of Object.keys(theme) as (keyof AdminThemeTokens)[]) {
    const value = theme[token];

    if (value) {
      variables[CSS_VARIABLE_BY_TOKEN[token]] = value;
    }
  }

  if (theme.primary || theme.accent) {
    variables["--gradient-cta"] =
      "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)";
  }

  if (theme.primary) {
    variables["--ring"] ??= "var(--primary)";
    variables["--sidebar-primary"] ??= "var(--primary)";
    variables["--glow-primary"] = "var(--primary)";
    variables["--shadow-glow"] = "0 0 20px hsl(var(--primary) / 0.15)";
    variables["--shadow-glow-strong"] =
      "0 0 40px hsl(var(--primary) / 0.25)";
  }

  if (theme.accent) {
    variables["--glow-accent"] = "var(--accent)";
  }

  if (theme.background || theme.card) {
    variables["--gradient-hero"] =
      "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 50%, hsl(var(--background)) 100%)";
    variables["--gradient-card"] =
      "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)";
  }

  return variables;
};