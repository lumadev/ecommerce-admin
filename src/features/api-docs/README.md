# Documentacao da API para lojistas

Esta feature documenta as APIs que o lojista pode usar para integrar o e-commerce da propria loja.

O escopo inclui somente metodos publicos de leitura consumidos pela loja virtual. Operacoes administrativas, como criar, editar ou remover categorias, nao devem ser listadas aqui.

Ao documentar novos recursos, confirme que cada endpoint e publico e informe os parametros, exemplos de requisicao e formato de resposta relevantes para a integracao do e-commerce.

Os dados dos endpoints ficam em `api-docs.data.ts`. A pagina compoe os cards de endpoint, que podem ser recolhidos individualmente, e os exemplos de codigo reutilizaveis. Novos endpoints devem seguir o tipo `ApiEndpoint`.