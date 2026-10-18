# Tema do Admin

Os componentes do Admin usam classes semânticas do Tailwind, como
`bg-background`, `text-foreground`, `bg-primary` e `border-border`. No
`src/index.css`, essas classes são ligadas a variáveis CSS como
`--background`, `--foreground` e `--primary`. O Tailwind continua responsável
pelas classes utilitárias; as variáveis fornecem os valores que podem mudar por
tema.

`AdminLayout` usa o `merchantId` da sessão para carregar os dados da loja,
incluindo seu `code`. `AdminTheme` seleciona o tema por esse código e aplica os
overrides ao elemento raiz do documento. Assim, componentes da tela e
conteúdos em portais, como menus e diálogos, usam as mesmas variáveis. Ao trocar
a loja personificada, o código carregado muda e o tema acompanha.

## Adicionar um tema

1. Crie uma entrada em `ADMIN_THEMES` usando `defineTheme` e tokens semânticos.
2. Associe os códigos das lojas em `ADMIN_THEME_BY_MERCHANT_CODE`.
3. Deixe tokens omitidos no valor padrão definido em `src/index.css`.

```ts
export const ADMIN_THEMES = {
  default: defineTheme({}),
  neutral: defineTheme({
    primary: "0 0% 24%",
    primaryForeground: "0 0% 100%",
    accent: "0 0% 92%",
    accentForeground: "0 0% 16%",
  }),
};

export const ADMIN_THEME_BY_MERCHANT_CODE = {
  "codigo-da-loja": "neutral",
} satisfies Record<string, AdminThemeName>;
```

Os valores de cor são tripletos HSL, sem `hsl()` e sem vírgulas. Por exemplo:
`"185 80% 55%"`. Sobrescreva também o token `*Foreground` correspondente
quando necessário para manter contraste legível.

## Tokens

| Token | Finalidade |
| --- | --- |
| `background` | Fundo principal das páginas. |
| `foreground` | Texto principal sobre o fundo. |
| `card` | Fundo de cards e áreas de conteúdo. |
| `cardForeground` | Texto sobre cards. |
| `popover` | Fundo de menus, popovers e diálogos. |
| `popoverForeground` | Texto sobre popovers. |
| `primary` | Ação principal, como botões e links destacados. |
| `primaryForeground` | Texto e ícones sobre a ação principal. |
| `secondary` | Ações e controles secundários. |
| `secondaryForeground` | Texto e ícones sobre a cor secundária. |
| `muted` | Áreas discretas, campos e conteúdo auxiliar. |
| `mutedForeground` | Legendas, placeholders e texto secundário. |
| `accent` | Realce complementar; participa do gradiente de ação existente. |
| `accentForeground` | Texto e ícones sobre o realce. |
| `destructive` | Ações destrutivas e estados de erro. |
| `destructiveForeground` | Texto e ícones sobre ações destrutivas. |
| `border` | Bordas e divisores. |
| `input` | Bordas de campos de formulário. |
| `ring` | Indicador de foco de campos e botões. |
| `sidebarBackground` | Fundo da barra lateral. |
| `sidebarForeground` | Texto da barra lateral. |
| `sidebarPrimary` | Ação selecionada ou principal da barra lateral. |
| `sidebarPrimaryForeground` | Texto sobre a ação principal da barra lateral. |
| `sidebarAccent` | Realce de itens da barra lateral. |
| `sidebarAccentForeground` | Texto sobre o realce da barra lateral. |
| `sidebarBorder` | Bordas da barra lateral. |
| `sidebarRing` | Indicador de foco na barra lateral. |
| `brand` | Cor de marca para pequenos detalhes (seleção de texto). Sem valor, usa `primary`. |
| `fontDisplay` | Fonte dos títulos (`h1`–`h6`, `font-display`). Ex.: `'"Fredoka"'`. |
| `fontBody` | Fonte do texto corrido. A fonte precisa estar carregada em `index.html`. |

Os botões primários usam `primary` como cor sólida. As classes de gradiente
explícitas continuam usando `primary` e `accent`; os efeitos de brilho também
acompanham essas cores. Ao alterar `background` ou `card`, os gradientes de
fundo e card são atualizados. As fontes só mudam quando o tema define
`fontDisplay`/`fontBody`; caso contrário valem Orbitron e Inter.

## Tema Mili

- O código `loja-da-mili` usa o tema `miliInfantil`, inspirado na referência
  visual da loja: fundo claro suave, verde sálvia para ações principais e rosa
  pálido para realces. Para ajustar a paleta, altere os tokens de
  `miliInfantil` em `adminThemeVars.ts`.
- Tipografia: títulos em Baloo 2 (arredondada e encorpada, como o letreiro da
  logo) e texto em Figtree, que tem x-height maior e lê melhor em tamanhos
  pequenos. O vermelho da joaninha (`brand`) aparece na seleção de texto.

## Tema Ecommerce 3D

- O código `ecommerce-3d` usa `ecommerce3d`, com a paleta escura original do
  sistema: fundo carvão, texto claro, ciano como cor primária e roxo como
  realce. Essa definição é independente do tema padrão atual do Admin.