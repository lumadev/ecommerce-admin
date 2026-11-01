---
description: "Use when a request mentions loja da Mili, loja do Weslley, Mili, Weslley, ecommerce3d, or store-specific Admin themes and typography."
applyTo: "src/features/theme/**/*.{ts,tsx}"
---

# Lojas e temas do Admin

- "Loja do Weslley" corresponde ao código da loja `ecommerce-3d` e ao tema `ecommerce3d`.
- "Loja da Mili" corresponde ao código da loja `milii-babystore` e ao tema `miliInfantil`.
- Para títulos da loja da Mili, preserve a tipografia `Baloo 2` (`fontDisplay`); não use a fonte padrão nem copie a tipografia da loja do Weslley.
- O tema `miliInfantil` mantém as cores padrão do Admin. A opção
  `pessegoSuave` é uma paleta creme, rosa antigo e pêssego reservada para
  uso futuro; não a associe à loja sem solicitação explícita.
- A loja do Weslley (`ecommerce-3d`) usa o tema escuro `ecommerce3d`.
  Mantenha fundos, superfícies, textos, bordas, campos, barra lateral e
  gradientes coerentes entre si ao alterar cores; não misture tokens claros do
  tema padrão com a paleta escura. Toasts de sucesso também devem usar fundo
  escuro, adequado ao tema.
- Ao alterar temas ou códigos de loja, mantenha esses mapeamentos alinhados entre `ADMIN_THEME_BY_MERCHANT_CODE` e a documentação do tema.
