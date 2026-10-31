# Módulos do Super Admin

Esta pasta reúne os módulos exclusivos do Super Admin. Cada módulo deve ficar
em sua própria subpasta, mantendo juntos seus componentes, formulários, hooks,
tipos e acesso a dados.

O módulo `merchant` fica em `admin/merchant` e concentra o gerenciamento de
lojas e de seus administradores. Funcionalidades compartilhadas com outros
perfis devem permanecer nas áreas comuns de `src/features`, fora desta pasta.
