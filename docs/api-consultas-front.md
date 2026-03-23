# Contrato esperado (proxy → API externa)

O Next repassa a query string para o backend.

## DIs registradas — todos os tipos

- `GET /consultas/di-registradas` — lista ampla (todos os tipos / cadastro completo).
- `GET /consultas/di-registradas?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD` — mesmo critério, filtrado por **data de registro** no intervalo.

## DIs liberadas — somente liberadas

- `GET /consultas/di-liberadas` — apenas processos/DIs **já liberados**.
- `GET /consultas/di-liberadas?data_inicio=...&data_fim=...` — idem, filtrado por **data de liberação** no intervalo.

Se o backend ainda não tratar `data_inicio` / `data_fim` nesses endpoints, é preciso implementá-lo na API (o front já envia os parâmetros).
