# Padrão de `merchantCode` nos exemplos

Os exemplos de requisição devem usar o código da loja efetivamente selecionada no painel administrativo. Não fixe um código de exemplo, não use `minha-loja` e não substitua o código da loja por seu ID.

## Origem do código

A página de documentação recebe `merchantCode` pelo contexto do `Outlet` do layout administrativo:

- Para um administrador de loja, use o código vinculado à sessão.
- Para um superadministrador, a documentação deve aparecer entre as rotas com seletor de loja, usando o código da loja selecionada.
- Se não houver código disponível, não exiba exemplos com um valor fictício; solicite a seleção ou identificação da loja.

## Localização por endpoint

Siga o contrato do endpoint documentado:

- Endpoints de catálogo e outras operações com escopo de loja recebem `merchantCode` na query string.
- Cadastro/autenticação de cliente e envio público de mensagem de contato recebem `merchantCode` no corpo, conforme o contrato da API.
- Checkout e consulta de status não recebem `merchantCode`: o backend identifica a loja pelos produtos do pedido ou pela chave única do checkout. Não acrescente o campo a essas requisições.

Ao adicionar um endpoint, coloque um token de substituição nos campos `path` e/ou `request` de `api-docs.data.ts` onde o contrato exige o código. A página substitui o token pelo código atual antes de renderizar os cards e os botões de cópia.
