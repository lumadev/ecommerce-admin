# Documentação da API para lojistas

Esta feature documenta as APIs que o lojista pode usar para integrar o e-commerce da própria loja.

Esta documentação mapeia apenas endpoints públicos consumidos pela loja virtual, como catálogo, autenticação de clientes e checkout. Endpoints administrativos não devem ser listados aqui.

Ao documentar novos recursos, confirme que cada endpoint é público e informe os parâmetros, exemplos de requisição e o formato de resposta relevantes para a integração do e-commerce. Consulte [o padrão de merchantCode](./docs/merchant-code-pattern.md): os exemplos devem usar o código efetivo da loja selecionada no painel, nunca um código fixo ou genérico.

Os contratos dos endpoints ficam em `endpoints/`, separados por catálogo, conta de cliente e pedidos. `api-docs.data.ts` reúne os grupos, preserva a ordem de exibição e substitui o token do `merchantCode` pelo código da loja atual; a URL base e o token ficam em `api-docs.constants.ts`. Novos endpoints devem seguir o tipo `ApiEndpoint`. Para endpoints que não recebem `merchantCode`, documente como a API identifica o contexto da loja em vez de adicionar o parâmetro artificialmente.