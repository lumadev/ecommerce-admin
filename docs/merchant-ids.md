# IDs das lojas

Os IDs (`merchant.id`) das lojas são gerados e mantidos pela API. Eles não
estão fixados neste repositório e podem mudar entre ambientes. Consulte a API
autenticada `GET /merchants` ou a área **Admin > Lojas** para obter os IDs
atuais.

## Identificadores encontrados no código

| Loja | Código (`merchant.code`) | ID (`merchant.id`) |
| --- | --- | --- |
| Loja da Mili | `milii-babystore` | Obtido em tempo de execução pela API |

O código `milii-babystore` é o único código de loja encontrado versionado no
frontend. Ele é usado para associar o tema Mili e restringir o roadmap dessa
loja. Esta lista não representa necessariamente todas as lojas cadastradas no
backend; para a relação atual, consulte `GET /merchants`.