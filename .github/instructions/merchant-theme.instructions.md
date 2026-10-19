---
description: "Use when a request mentions loja da Mili, loja do Weslley, Mili, Weslley, ecommerce3d, or store-specific Admin themes and typography."
applyTo: "src/features/theme/**/*.{ts,tsx}"
---

# Lojas e temas do Admin

- "Loja do Weslley" corresponde ao código da loja `ecommerce-3d` e ao tema `ecommerce3d`.
- "Loja da Mili" corresponde ao código da loja `milii-babystore` e ao tema `miliInfantil`.
- Para títulos da loja da Mili, preserve a tipografia `Baloo 2` (`fontDisplay`); não use a fonte padrão nem copie a tipografia da loja do Weslley.
- Por enquanto, as cores da loja da Mili devem seguir os padrões do Super Admin; não adicione overrides de cores ao tema `miliInfantil`.
- Ao alterar temas ou códigos de loja, mantenha esses mapeamentos alinhados entre `ADMIN_THEME_BY_MERCHANT_CODE` e a documentação do tema.
