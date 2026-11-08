# Documentacao da API para lojistas

Esta feature documenta as APIs que o lojista pode usar para integrar o e-commerce da propria loja.

O escopo inclui endpoints publicos consumidos pela loja virtual, como catalogo, autenticacao de clientes e checkout. Operacoes administrativas, como criar, editar ou remover categorias, nao devem ser listadas aqui.

Ao documentar novos recursos, confirme que cada endpoint e publico e informe os parametros, exemplos de requisicao e formato de resposta relevantes para a integracao do e-commerce. Consulte [o padrao de merchantCode](./docs/merchant-code-pattern.md): os exemplos devem usar o codigo efetivo da loja selecionada no painel, nunca um codigo fixo ou generico.

Os contratos dos endpoints ficam em `endpoints/`, separados por catalogo, conta de cliente e pedidos. `api-docs.data.ts` reune os grupos, preserva a ordem de exibicao e substitui o token do `merchantCode` pelo codigo da loja atual; a URL base e o token ficam em `api-docs.constants.ts`. Novos endpoints devem seguir o tipo `ApiEndpoint`. Para endpoints que nao recebem `merchantCode`, documente como a API identifica o contexto da loja em vez de adicionar o parametro artificialmente.