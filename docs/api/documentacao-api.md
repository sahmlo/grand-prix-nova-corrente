# Documentação da API

A API do projeto **Nova Corrente** possui endpoints para cadastro de materiais, serviços e consumos, além de recursos para visualização de consumo e recomendação de estoque.

## Cadastro

### Material

```http
POST /material/
```

Envia um JSON com os dados do material.

### Serviço

```http
POST /servico/
```

Envia um JSON com os dados do serviço.

### Consumo

```http
POST /consumo/
```

Envia um JSON com os dados de consumo.

## Gráfico de consumo

```http
GET /grafico/consumo_por_servico/{material_id}
```

Retorna uma imagem PNG com o gráfico de consumo por serviço. A documentação original indica que a URL pode ser utilizada diretamente no atributo `src` de uma tag `<img>`.

## Recomendação de estoque

```http
GET /recomendacao/{material_id}?estoque_atual={numero}
```

Recebe o ID do material e o estoque atual como parâmetro de consulta.

### Exemplo

```http
GET /recomendacao/CABO-001?estoque_atual=300
```

A resposta retorna um JSON contendo um alerta de estoque (`VERDE`, `AMARELO` ou `VERMELHO`) e o texto da recomendação.

> **Observação:** este repositório contém o front-end disponibilizado para o portfólio. A documentação da API é mantida aqui como documentação complementar do projeto.
