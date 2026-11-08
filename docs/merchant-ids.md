# IDs das lojas

Os IDs (`merchant.id`) das lojas são gerados e mantidos pela API. Eles não
estão fixados neste repositório e podem mudar entre ambientes. Consulte a API
autenticada `GET /merchants` ou a área **Admin > Lojas** para obter os IDs
atuais.

## Identificadores encontrados no código

| Loja | Código (`merchant.code`) | ID (`merchant.id`) |
| --- | --- | --- |
| Loja do Weslley (Ecommerce 3d) | `ecommerce-3d` | Obtido em tempo de execução pela API |
| Loja da Mili | `milii-babystore` | Obtido em tempo de execução pela API |

O código `ecommerce-3d` é a loja padrão selecionada para Super Admin nas
listagens de dados por loja. Ele também identifica a loja do Weslley. O código
`milii-babystore` é usado para associar o tema Mili e restringir o roadmap dessa
loja. Esta lista não representa necessariamente todas as lojas cadastradas no
backend; para a relação atual, consulte `GET /merchants`.