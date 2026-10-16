# Painel de gerenciamento de lojas

Este projeto é a interface administrativa para configurar e gerenciar lojas de
e-commerce. O painel reúne recursos para administrar lojas, produtos,
categorias, variantes, destaques, clientes e pedidos. O escopo do produto também
inclui o gerenciamento de informações das lojas e o envio de mídias, como fotos
e vídeos.

## Executar localmente

Instale as dependências e inicie a aplicação:

```bash
pnpm install
pnpm dev
```

## Configuração da API

Em desenvolvimento, a API usa `http://localhost:3000/api` por padrão. Para usar
outra URL, defina `VITE_API_URL` no ambiente:

```bash
VITE_API_URL=https://api.example.com/api pnpm build
```

Não inclua arquivos `.env` com valores reais no repositório. Use um arquivo
`.env.example` como referência para a configuração local.

## Rotas do painel

- `/login`: autenticação administrativa.
- `/`: página inicial do painel.
- `/pedidos`, `/produtos`, `/categorias`, `/variantes`, `/destaques`,
  `/clientes` e `/lojas`: áreas de gerenciamento.

As páginas administrativas exigem autenticação. A área pública da antiga loja
não é montada como rota de entrada da aplicação.

## Organização do código

As funcionalidades administrativas ficam em `src/features/`, agrupadas
por domínio. Rotas e inicialização da aplicação ficam, respectivamente, em
`src/routes` e `src/App.tsx`; componentes e infraestrutura compartilhados ficam
em `src/shared` e `src/infra`.
