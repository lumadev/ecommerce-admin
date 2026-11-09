# Documentação da API para lojistas

Esta feature documenta as APIs que o lojista pode usar para integrar o e-commerce da própria loja.

O escopo inclui endpoints públicos consumidos pela loja virtual, como catálogo, autenticação de clientes e checkout. Operações administrativas, como criar, editar ou remover categorias, não devem ser listadas aqui.

Ao documentar novos recursos, confirme que cada endpoint é público e informe os parâmetros, exemplos de requisição e formato de resposta relevantes para a integração do e-commerce. Consulte [o padrão de merchantCode](./docs/merchant-code-pattern.md): os exemplos devem usar o código efetivo da loja selecionada no painel, nunca um código fixo ou genérico.

Os contratos dos endpoints ficam em `endpoints/`, separados por catálogo, conta de cliente e pedidos. `api-docs.data.ts` reúne os grupos, preserva a ordem de exibição e substitui o token do `merchantCode` pelo código da loja atual; a URL base e o token ficam em `api-docs.constants.ts`. Novos endpoints devem seguir o tipo `ApiEndpoint`. Para endpoints que não recebem `merchantCode`, documente como a API identifica o contexto da loja em vez de adicionar o parâmetro artificialmente.