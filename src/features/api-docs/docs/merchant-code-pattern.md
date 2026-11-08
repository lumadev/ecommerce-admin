# Padrao de `merchantCode` nos exemplos

Os exemplos de requisicao devem usar o codigo da loja efetivamente selecionada no painel administrativo. Nao fixe um codigo de exemplo, nao use `minha-loja` e nao substitua o codigo da loja por seu ID.

## Origem do codigo

A pagina de documentacao recebe `merchantCode` pelo contexto do `Outlet` do layout administrativo:

- Para um administrador de loja, use o codigo vinculado a sessao.
- Para um superadministrador, a documentacao deve aparecer entre as rotas com seletor de loja, usando o codigo da loja selecionada.
- Se nao houver codigo disponivel, nao exiba exemplos com um valor ficticio; solicite a selecao/identificacao da loja.

## Localizacao por endpoint

Siga o contrato do endpoint documentado:

- Endpoints de catalogo e outras operacoes com escopo de loja recebem `merchantCode` na query string.
- Cadastro/autenticacao de cliente e solicitacao publica de encomenda recebem `merchantCode` no corpo, conforme o contrato da API.
- Checkout e consulta de status nao recebem `merchantCode`: o backend identifica a loja pelos produtos do pedido ou pela chave unica do checkout. Nao acrescente o campo a essas requisicoes.

Ao adicionar um endpoint, coloque um token de substituicao nos campos `path` e/ou `request` de `api-docs.data.ts` onde o contrato exige o codigo. A pagina substitui o token pelo codigo atual antes de renderizar os cards e os botoes de copia.
