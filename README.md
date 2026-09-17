# 🌊 Nova Corrente — Previsibilidade de Demanda

🏆 **3º lugar — Grand Prix de Inovação do SENAI 2025**

Projeto desenvolvido em equipe durante o **Grand Prix de Inovação do SENAI**, realizado em novembro de 2025.

O **Nova Corrente** é uma solução voltada à gestão de estoque e previsibilidade de demanda, reunindo recursos de cadastro, acompanhamento de consumo, controle de perdas, análises, relatórios e recomendações para auxiliar na tomada de decisões.

---

## 🎯 Sobre o projeto

O sistema foi desenvolvido durante a competição como uma solução para apoiar o gerenciamento de materiais e serviços.

A aplicação reúne diferentes funcionalidades para centralizar informações e apresentar dados que podem auxiliar no acompanhamento do estoque e na análise da demanda.

### Principais funcionalidades

- Dashboard com visão geral do sistema
- Cadastro de itens
- Cadastro de serviços
- Registro e acompanhamento de perdas
- Análise de consumo por serviço
- Projeção de demanda
- Análise estratégica
- Centro de relatórios
- Analytics
- Insights e recomendações
- Assistente virtual com IA
- Configurações do sistema
- Gerenciamento de usuários e sessão

---

## 💻 Tecnologias

### Front-end

- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- Google Fonts — Inter

### Recursos utilizados

- LocalStorage
- SVG
- Manipulação do DOM
- Formulários
- Validações
- Responsividade
- Exportação de dados
- Geração de relatórios

---

## 🗂️ Estrutura do projeto

```text
grand-prix-nova-corrente/
│
├── README.md
├── index.html
├── estilos.css
├── script.js
├── .gitignore
│
└── docs/
    └── api/
        └── documentacao-api.md
```

### `index.html`

Responsável pela estrutura das telas e componentes da aplicação.

Inclui:

- Tela de login
- Dashboard
- Cadastros
- Análises
- Relatórios
- Analytics
- Análise estratégica
- Configurações
- Assistente virtual

### `estilos.css`

Responsável pela estilização da aplicação, incluindo:

- Layout
- Sidebar
- Cards
- Formulários
- Tabelas
- Botões
- Gráficos
- Modais
- Responsividade
- Animações
- Temas visuais

### `script.js`

Responsável pela lógica da aplicação, incluindo:

- Autenticação e sessão
- Navegação entre páginas
- Cadastro, edição e exclusão de dados
- Gerenciamento de itens, serviços e perdas
- Filtros e pesquisas
- Dashboard
- Analytics
- Relatórios
- Exportação de dados
- Configurações
- Assistente virtual
- Persistência de dados com `localStorage`

---

## 🔌 API

O projeto também possui uma API documentada para operações relacionadas aos dados do sistema.

### Cadastro

```text
POST /material/
POST /servico/
POST /consumo/
```

### Gráfico de consumo

```text
GET /grafico/consumo_por_servico/{material_id}
```

### Recomendação

```text
GET /recomendacao/{material_id}?estoque_atual={numero}
```

O endpoint de recomendação utiliza o ID do material e o estoque atual para retornar um alerta de estoque (`VERDE`, `AMARELO` ou `VERMELHO`) junto com uma recomendação.

> A API/back-end não está incluída neste repositório. Este repositório contém a versão do front-end disponibilizada para documentação e portfólio.

A documentação detalhada da API está disponível em [`docs/api/documentacao-api.md`](docs/api/documentacao-api.md).

---

## 👩‍💻 Minha participação

Durante o desenvolvimento do projeto, participei de diferentes etapas da construção da solução.

- Desenvolvimento do **Front-end**
- **Product Management (PM)**
- **Modelagem da solução**
- Organização e definição das funcionalidades junto à equipe
- Construção e organização das interfaces da aplicação

---

## 👥 Equipe

Projeto desenvolvido colaborativamente durante o **Grand Prix de Inovação do SENAI**.

| Integrante | Participação |
|---|---|
| **Sara Melo** | Front-end, PM e Modelagem |
| **Ericsson** | Back-end, Power BI, PM e Modelagem |
| **Luiz** | Front-end |
| **Douglas** | Front-end |
| **Cauan** | Documentação |

### 🔗 LinkedIn

- **Ericsson:** [LinkedIn](https://www.linkedin.com/in/ericsson-dos-santos/)
- **Luiz:** [LinkedIn](https://www.linkedin.com/in/luis-fernando-front-end/)
- **Douglas:** [LinkedIn](https://www.linkedin.com/in/douglass154/)
- **Cauan:** [LinkedIn](https://www.linkedin.com/in/caua-santos-069aa6390/)

---

## 🏆 Resultado

🥉 **3º lugar no Grand Prix de Inovação do SENAI — 2025**

O projeto **Nova Corrente** foi desenvolvido em equipe durante a competição, realizada em novembro de 2025.

Durante o desenvolvimento, a equipe trabalhou em diferentes frentes, incluindo:

- Front-end
- Back-end
- Power BI
- Modelagem
- Product Management
- Documentação
- Integração com IA
- Hospedagem na AWS

---

## 📅 Contexto do projeto

**Novembro de 2025**

O projeto foi desenvolvido durante uma dinâmica de competição e trabalho colaborativo do Grand Prix de Inovação do SENAI.

A equipe teve como objetivo desenvolver e apresentar uma solução tecnológica para o problema proposto durante a competição.

---

## 📌 Status

**Concluído — projeto desenvolvido durante o Grand Prix de Inovação do SENAI em novembro de 2025.**

O repositório está sendo mantido como registro do projeto e como parte do meu portfólio acadêmico e profissional.

---

## 📖 Créditos

O projeto foi desenvolvido colaborativamente pela equipe durante a competição.

Este repositório foi criado para **documentar minha participação no projeto e apresentá-lo como parte do meu portfólio**, mantendo os créditos dos demais integrantes da equipe.

O projeto original foi desenvolvido utilizando um computador disponibilizado para a equipe durante a competição. Por esse motivo, o histórico original de commits não representa necessariamente todos os integrantes que participaram do desenvolvimento.

---

**Projeto acadêmico — SENAI | Grand Prix de Inovação 2025**
