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
  skeletonHighlight?: string;
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
  /** Cor de marca para pequenos detalhes (tripleto HSL). */
  brand?: string;
  toastSuccessBackground?: string;
  toastSuccessForeground?: string;
  toastSuccessBorder?: string;
  toastErrorBackground?: string;
  toastErrorForeground?: string;
  toastErrorBorder?: string;
  /** Família tipográfica dos títulos, ex.: '"Fredoka"'. */
  fontDisplay?: string;
  /** Família tipográfica do texto corrido. */
  fontBody?: string;
}

const defineTheme = (tokens: AdminThemeTokens): AdminThemeTokens => tokens;

export const ADMIN_THEMES = {
  default: defineTheme({}),
  ecommerce3d: defineTheme({
    fontDisplay: '"Orbitron"',
    fontBody: '"Inter"',
    background: "220 20% 6%",
    foreground: "200 20% 92%",
    card: "220 18% 10%",
    cardForeground: "200 20% 92%",
    popover: "220 18% 10%",
    popoverForeground: "200 20% 92%",
    primary: "185 80% 55%",
    primaryForeground: "220 20% 6%",
    secondary: "220 15% 16%",
    secondaryForeground: "200 20% 85%",
    muted: "220 15% 14%",
    mutedForeground: "215 12% 55%",
    skeletonHighlight: "220 15% 22%",
    accent: "280 70% 60%",
    accentForeground: "200 20% 95%",
    destructive: "0 72% 55%",
    destructiveForeground: "210 40% 98%",
    border: "220 15% 18%",
    input: "220 15% 18%",
    ring: "185 80% 55%",
    sidebarBackground: "220 18% 8%",
    sidebarForeground: "200 20% 85%",
    sidebarPrimary: "185 80% 55%",
    sidebarPrimaryForeground: "220 20% 6%",
    sidebarAccent: "220 15% 16%",
    sidebarAccentForeground: "200 20% 85%",
    sidebarBorder: "220 15% 18%",
    sidebarRing: "185 80% 55%",
    toastSuccessBackground: "150 24% 14%",
    toastSuccessForeground: "145 42% 82%",
    toastSuccessBorder: "145 30% 28%",
  }),
  miliInfantil: defineTheme({
    fontDisplay: '"Baloo 2"',
    fontBody: '"Figtree"',
    toastErrorBackground: "0 75% 96%",
    toastErrorForeground: "0 55% 36%",
    toastErrorBorder: "0 50% 86%",
  }),
  pessegoSuave: defineTheme({
    fontDisplay: '"Baloo 2"',
    fontBody: '"Figtree"',
    background: "38 48% 97%",
    foreground: "345 16% 20%",
    card: "40 60% 99%",
    cardForeground: "345 16% 20%",
    popover: "40 60% 99%",
    popoverForeground: "345 16% 20%",
    primary: "350 34% 44%",
    primaryForeground: "40 60% 99%",
    secondary: "350 38% 93%",
    secondaryForeground: "345 26% 30%",
    muted: "38 30% 94%",
    mutedForeground: "345 10% 42%",
    accent: "22 58% 89%",
    accentForeground: "20 34% 28%",
    border: "24 24% 86%",
    input: "24 22% 82%",
    ring: "350 34% 48%",
    sidebarBackground: "350 36% 96%",
    sidebarForeground: "345 16% 24%",
    sidebarPrimary: "350 34% 44%",
    sidebarPrimaryForeground: "40 60% 99%",
    sidebarAccent: "350 38% 91%",
    sidebarAccentForeground: "345 26% 30%",
    sidebarBorder: "24 24% 86%",
    sidebarRing: "350 34% 48%",
    toastSuccessBackground: "112 32% 94%",
    toastSuccessForeground: "120 28% 28%",
    toastSuccessBorder: "112 24% 82%",
  }),
};

export type AdminThemeName = keyof typeof ADMIN_THEMES;

export const ADMIN_THEME_BY_MERCHANT_CODE: Record<string, AdminThemeName> = {
  "ecommerce-3d": "ecommerce3d",
  "milii-babystore": "miliInfantil",
};

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
  skeletonHighlight: "--skeleton-highlight",
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
  brand: "--brand",
  toastSuccessBackground: "--toast-success-background",
  toastSuccessForeground: "--toast-success-foreground",
  toastSuccessBorder: "--toast-success-border",
  toastErrorBackground: "--toast-error-background",
  toastErrorForeground: "--toast-error-foreground",
  toastErrorBorder: "--toast-error-border",
  fontDisplay: "--font-display-family",
  fontBody: "--font-body-family",
};

export const getAdminThemeCssVariables = (
  merchantCode?: string | null,
): Record<string, string> => {
  const themeName = merchantCode
    ? ADMIN_THEME_BY_MERCHANT_CODE[merchantCode]
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