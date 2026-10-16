# Arquitetura de formulários do Admin

## Objetivo

Os formulários da área administrativa devem separar a apresentação dos campos
da orquestração do fluxo de criação e edição. Isso mantém a mesma experiência
entre os recursos do admin e evita duplicação de campos, validações visuais e
estados de carregamento.

## Estrutura por recurso

Cada recurso com formulário deve seguir esta organização:

```text
src/features//<recurso>/
├── form/
│   ├── <Recurso>Form.tsx
│   ├── Create<Recurso>Dialog.tsx
│   ├── Edit<Recurso>Dialog.tsx
│   └── <Componentes auxiliares do formulário>.tsx
├── types/
│   └── <recurso>-form.types.ts
├── hooks/
├── repositories/
└── list/
```

### Responsabilidade de cada camada

- **`<Recurso>Form.tsx`**: renderiza os campos e recebe `form` e `onChange`
  por propriedades. Não deve conhecer criação, edição, repositórios ou
  notificações.
- **`Create<Recurso>Dialog.tsx`**: mantém o estado inicial, valida os dados
  necessários para criação, transforma o estado do formulário no payload e
  chama a operação recebida por propriedade.
- **`Edit<Recurso>Dialog.tsx`**: converte o item selecionado para o estado do
  formulário, sincroniza a troca do item e chama a operação de atualização.
- **Componentes auxiliares**: encapsulam campos complexos, como upload,
  hashtags e seleção de categorias.
- **`types/<recurso>-form.types.ts`**: define o estado editável do formulário.
  Valores controlados podem permanecer como `string` para facilitar a edição;
  a conversão para números ou payloads da API ocorre no diálogo ou na camada
  de dados.

## Fluxo de dados

```text
Admin<Recurso>
  ├── abre Create<Recurso>Dialog
  │     └── <Recurso>Form (estado vazio)
  └── abre Edit<Recurso>Dialog
        └── <Recurso>Form (estado derivado do item)

<Recurso>Form
  ── onChange(field, value) ──> Dialog
  ── submit do Dialog ──> hook/repository recebido por propriedade
```

O formulário é controlado pelo diálogo. O diálogo é responsável por estados
de carregamento, mensagens de validação, reset após sucesso/cancelamento e
pela conversão dos valores antes de chamar a operação de persistência.

## Padrão aplicado atualmente

Os formulários de categoria e produto seguem essa arquitetura:

- `src/features//category/form/CategoryForm.tsx`
- `src/features//category/form/CreateCategoryDialog.tsx`
- `src/features//category/form/EditCategoryDialog.tsx`
- `src/features//category/types/category-form.types.ts`
- `src/features//product/form/ProductForm.tsx`
- `src/features//product/form/CreateProductDialog.tsx`
- `src/features//product/form/EditProductDialog.tsx`
- `src/features//product/types/product-form.types.ts`

O produto já está alinhado ao padrão de categoria: possui um componente de
formulário compartilhado entre criação e edição, diálogos independentes, tipo
de estado próprio e componentes auxiliares para campos específicos.

O formulário do produto organiza os campos em abas de **Dados do produto** e
**Fotos e vídeos**. A galeria permite múltiplos arquivos e reordenação; a
primeira mídia é a capa. Cada arquivo mantém tipo e identificador no estado do
formulário, e o backend persiste os itens em uma tabela relacionada ao produto
com uma posição própria. Vídeos aceitam até 100 MB e 60 segundos; imagens
mantêm o limite de 5 MB.

O formulário do produto organiza os campos em abas de **Dados do produto** e
**Fotos e vídeos**. A galeria permite múltiplos arquivos e reordenação; a
primeira mídia é a capa. Cada arquivo mantém tipo e identificador no estado do
formulário, e o backend persiste os itens em uma tabela relacionada ao produto
com uma posição própria. Vídeos aceitam até 100 MB e 60 segundos; imagens
mantêm o limite de 5 MB.

## Regras de implementação

1. Use imports absolutos `@/` para módulos compartilhados ou de outra
   feature; use imports relativos apenas dentro do próprio recurso quando isso
   seguir o padrão existente.
2. Mantenha `Create` e `Edit` como diálogos distintos, mesmo quando
   compartilham todos os campos.
3. Não coloque chamadas a hooks de persistência ou repositories dentro de
   `<Recurso>Form.tsx`.
4. Valide campos obrigatórios antes da chamada de criação/edição e mostre
   erros usando o mecanismo de notificação já adotado pelo admin.
5. Desabilite ações enquanto uma operação assíncrona estiver em andamento e
   exiba o estado de carregamento no botão.
6. Ao adicionar upload ou outro efeito externo, trate também o cancelamento e
   a limpeza conforme o contrato do componente auxiliar.
7. Ao adicionar um novo campo, atualize o tipo de estado, o formulário e os
   mapeamentos de criação e edição.
