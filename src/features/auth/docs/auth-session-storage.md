# Persistencia da autenticacao no navegador

## Web Storage

| Armazenamento | Chave | Valor | Motivo e ciclo de vida |
| --- | --- | --- | --- |
| `localStorage` | `auth:authenticated` | A string `"true"` | Marcador para decidir, ao iniciar o provider, se deve consultar `/auth/me` e restaurar a sessao. E removido ao fazer logout, quando a sessao falha ou quando o usuario retornado nao tem o perfil esperado. |
| `sessionStorage` | Nenhuma | Nenhum | O codigo da aplicacao nao grava dados nesse armazenamento. |

O marcador local nao e um token nem prova de autenticacao. Se estiver ausente ou diferente de `"true"`, o provider nao consulta a sessao automaticamente na inicializacao. Se estiver presente, o provider chama `/auth/me`; so essa resposta valida a sessao e preenche o usuario em memoria.

## Dados mantidos fora do Web Storage

- Senha e credenciais de login sao enviadas no corpo da requisicao de login; o frontend nao as grava em `localStorage` ou `sessionStorage`.
- Os dados do usuario retornados por `/auth/me` ficam no estado React do provider. Sao descartados quando a aplicacao e recarregada e recuperados novamente pela API quando o marcador local existe.
- O cliente Axios de autenticacao usa `withCredentials: true`, permitindo o envio e recebimento de credenciais de cookie nas requisicoes. O frontend nao le nem grava manualmente o cookie de sessao; existencia, nome, duracao e atributos de seguranca do cookie dependem do backend.

## Fluxo

1. Um login bem-sucedido e seguido por uma chamada a `/auth/me`.
2. Se o usuario tiver o perfil esperado, o provider guarda o usuario em memoria e grava `auth:authenticated = "true"` em `localStorage`.
3. Na inicializacao, esse marcador faz o provider tentar restaurar o usuario por `/auth/me`.
4. Logout, falha na verificacao de sessao ou perfil incompatível removem o marcador e limpam o usuario em memoria.

Como `localStorage` sobrevive ao fechamento da aba e ao recarregamento, o marcador permite tentar restaurar a sessao em uma visita posterior. Ele nao expira por conta propria; sua validade efetiva depende da sessao reconhecida pelo backend.