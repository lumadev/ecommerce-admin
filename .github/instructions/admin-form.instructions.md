---
applyTo: "src/features//**/form/**/*.{ts,tsx}"
---

# Instruções para formulários do Admin

Ao criar ou alterar um formulário em `src/features/`:

- Siga a arquitetura descrita em [`docs/architecture/admin-form.md`](../../docs/architecture/admin-form.md).
- Mantenha um componente `<Recurso>Form.tsx` compartilhado entre os fluxos de
  criação e edição.
- Mantenha `Create<Recurso>Dialog.tsx` e `Edit<Recurso>Dialog.tsx` separados.
- Faça o formulário receber estado e callback `onChange` por propriedades; não
  coloque persistência, repositories ou notificações no componente de campos.
- Defina o estado editável em `types/<recurso>-form.types.ts`.
- Faça os diálogos validarem e converterem os valores antes de chamar hooks ou
  repositories.
- Reutilize os componentes de UI existentes e os componentes auxiliares do
  recurso para campos complexos.
- Preserve estados controlados, loading, reset após sucesso e cancelamento
  seguro de uploads ou efeitos externos.
- Ao adicionar um campo, atualize todos os pontos: tipo, formulário, estado
  inicial, mapeamento de edição e payload de criação/atualização.
- Preserve os padrões de importação, nomenclatura e estilização já usados na
  feature.
