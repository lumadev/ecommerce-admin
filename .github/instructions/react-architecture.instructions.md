---
applyTo: "src/**/*.{ts,tsx}"
---

# Instruções de arquitetura React

> **Quando ler este arquivo:** consulte estas instruções **somente** ao criar
> uma nova feature/recurso (nova pasta em `src/features` ou `src/pages`) ou ao
> implementar lógica complexa (fluxos com múltiplos estados, integrações com
> API, orquestração de vários hooks, formulários avançados, etc.). Para
> alterações pequenas e localizadas (ajuste de estilo, texto, prop simples,
> correção pontual) não é necessário aplicar todas as regras abaixo.

## Arquitetura de pastas (feature-based)

O projeto usa uma arquitetura orientada a features, não por tipo de arquivo
global. Cada recurso de negócio vive em `src/features/<feature>/` (ou
`src/features//<recurso>/` para a área administrativa) com subpastas por
responsabilidade:

```text
src/features/<feature>/
├── components/     # componentes de apresentação da feature
├── hooks/          # hooks que orquestram estado e chamadas de dados
├── repositories/   # acesso a dados (HTTP/API), sem lógica de UI
├── mappers/         # conversão entre payload de API e modelo de domínio
├── types/          # tipos e contratos da feature
└── docs/           # documentação de arquitetura da feature (quando existir)
```

- Código compartilhado entre features fica em `src/shared`, `src/hooks`,
  `src/lib` e `src/infra` (ex.: `src/infra/http` para o cliente HTTP).
- Componentes de página/roteamento ficam em `src/pages` e usam componentes das
  features; evite colocar lógica de negócio diretamente em `src/pages`.
- Não crie pastas genéricas como `src/utils` ou `src/components` no nível
  global para uma feature específica; a lógica de um recurso pertence à pasta
  dele em `src/features`.
- Ao criar uma feature nova, replique a estrutura acima, criando apenas as
  subpastas que forem realmente necessárias (nem toda feature precisa de
  `repositories` ou `mappers`).

## Nomenclatura de arquivos

- **Componentes React**: `PascalCase.tsx`, com o nome do arquivo igual ao
  nome do componente exportado (ex.: `ProductCard.tsx`, `ProductGrid.tsx`).
- **Hooks**: `camelCase.ts` sempre prefixado com `use` (ex.: `useProduct.ts`,
  `useCategoriesSection.ts`). Um hook por arquivo.
- **Repositories**: `camelCaseRepository.ts` (ex.: `productRepository.ts`).
- **Mappers**: `to<Entidade>.ts` para conversão de payload em modelo de
  domínio (ex.: `toProduct.ts`).
- **Tipos**: `<contexto>.types.ts` (ex.: `product-media.types.ts`,
  `cart.types.ts`) ou `<contexto>-form.types.ts` para estado de formulário.
- **Contexto/Provider**: `<recurso>.context.tsx` e `<recurso>.provider.tsx`
  quando a feature usa Context API (ex.: `cart.context.tsx`,
  `cart.provider.tsx`).
- Utilitários e seletores da feature seguem `<recurso>.utils.ts` e
  `<recurso>.selectors.ts`.
- Diálogos de formulário do admin seguem `Create<Recurso>Dialog.tsx` e
  `Edit<Recurso>Dialog.tsx`, com um `<Recurso>Form.tsx` compartilhado (ver
  [`docs/admin-form.md`](../../src/features//docs/admin-form.md)).

## Divisão de componentes

- Prefira componentes pequenos e focados em uma única responsabilidade visual
  em vez de um componente grande com muitas ramificações condicionais.
- Extraia um subcomponente quando um bloco de JSX tiver lógica própria,
  aparecer em mais de um lugar ou ultrapassar uma tela de complexidade visual
  (ex.: `MediaCarousel.tsx`, `ProductGridSkeleton.tsx` extraídos de
  `ProductDetails`/`ProductGrid`).
- Separe estados de carregamento e "não encontrado" em componentes próprios
  (ex.: `ProductDetailsSkeleton.tsx`, `ProductNotFound.tsx`) em vez de
  condicionais extensas dentro do componente principal.
- Componentes de apresentação recebem dados e callbacks via props; não devem
  chamar repositories, contexts globais ou lógica de persistência
  diretamente (essa responsabilidade fica no componente orquestrador ou no
  hook que o alimenta).
- Componentes de orquestração (páginas, seções, diálogos) conectam hooks,
  repositories e componentes de apresentação, mas delegam a renderização de
  detalhes a componentes menores.

## Uso de hooks

- Hooks de dados (`use<Recurso>`, `use<Recurso>s`) concentram: estado
  (`useState`), efeitos de busca (`useEffect`), cancelamento de requisições
  (`AbortController`) e tratamento de erro/loading. Componentes não devem
  duplicar esse controle localmente.
- Sempre cancele efeitos assíncronos no cleanup do `useEffect` (via
  `AbortController` ou flag de montagem) para evitar `setState` após
  desmontagem.
- Hooks que expõem contexto (ex.: `useCartContext`) devem lançar erro
  explícito quando usados fora do respectivo `Provider`.
- Não crie hooks que misturem múltiplas responsabilidades não relacionadas;
  prefira compor hooks pequenos (`useProduct`, `useProducts`,
  `useCategoriesSection`) a um hook único monolítico por feature.
- Evite lógica de negócio dentro de componentes quando ela pode ser extraída
  para um hook reutilizável e testável isoladamente.
- Hooks genéricos e sem relação com uma feature específica (ex.:
  `use-mobile.tsx`, `use-toast.ts`) ficam em `src/hooks`, não dentro de uma
  feature.

## Estrutura da lógica dos componentes

Ordem recomendada dentro de um componente de orquestração:

1. Hooks de estado e contexto (`useState`, `useContext`, hooks de dados da
   feature).
2. Hooks de navegação/efeitos colaterais (`useNavigate`, `useEffect`).
3. Funções auxiliares/handlers derivados do estado (ex.:
   `goToProductDetails`).
4. Cedo-retorno (`if (isLoading) return <Skeleton />`, `if (!product) return
   <NotFound />`) antes do JSX principal, evitando aninhamento profundo de
   condicionais no retorno final.
5. JSX principal, delegando blocos complexos a subcomponentes.

- Prefira `interface <Componente>Props` declarada acima do componente e
  tipada explicitamente, mesmo quando as props forem simples.
- Evite lógica assíncrona inline dentro do JSX; extraia para uma função
  nomeada e chame-a a partir do handler do evento.
- Ao adicionar uma integração de API nova, siga o fluxo já usado no projeto:
  `repository` (chamada HTTP) → `mapper` (conversão para o modelo de
  domínio) → `hook` (estado/loading/erro) → `componente` (apresentação).
