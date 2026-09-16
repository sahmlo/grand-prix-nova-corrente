# Nova Corrente — Previsibilidade de Demanda

Projeto desenvolvido em equipe durante o **Grand Prix de Inovação do SENAI**.

O **Nova Corrente** é uma solução voltada à gestão de estoque e previsibilidade de demanda, reunindo recursos de cadastro, acompanhamento de consumo, controle de perdas, análises, relatórios e recomendações para auxiliar na tomada de decisões.

## 🎯 Sobre o projeto

O sistema foi desenvolvido durante a competição como uma solução para apoiar o gerenciamento de materiais e serviços.

A aplicação conta com diferentes módulos para centralizar informações e apresentar dados que podem auxiliar no acompanhamento do estoque e na análise da demanda.

Entre os principais recursos estão:

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

## 🗂️ Estrutura do projeto

```text
grand-prix-nova-corrente/
│
├── index.html
├── estilos.css
└── scrpt.js
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

### `scrpt.js`

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

## 🔌 API

O projeto também possui uma API documentada para operações relacionadas aos dados do sistema.

Entre os endpoints documentados estão:

```text
POST /material/
POST /servico/
POST /consumo/

GET /grafico/consumo_por_servico/{material_id}

GET /recomendacao/{material_id}?estoque_atual={numero}
```

O endpoint de recomendação utiliza o material e o estoque atual para retornar um alerta de estoque (`VERDE`, `AMARELO` ou `VERMELHO`) junto com uma recomendação.

> A API/back-end não está incluída neste repositório. Este repositório contém a versão do front-end disponibilizada para documentação e portfólio.

## 👩‍💻 Minha participação

Durante o desenvolvimento do projeto, participei de diferentes etapas da construção da solução.

- Desenvolvimento do **Front-end**
- **Product Management (PM)**
- **Modelagem do projeto**

Também contribuí para a organização da solução e para a construção das interfaces durante a competição.

## 👥 Equipe

Projeto desenvolvido colaborativamente durante o **Grand Prix de Inovação do SENAI**.

- **Sara Melo** — Front-end, PM e Modelagem
- **Ericson** — Back-end, Power BI, PM e Modelagem · [LinkedIn](https://www.linkedin.com/in/ericsson-dos-santos/)
- **Luiz** — Front-end · [LinkedIn](https://www.linkedin.com/in/luis-fernando-front-end/)
- **Douglas** — Front-end · [LinkedIn](https://www.linkedin.com/in/douglass154/)
- **Cauan** — Documentação · [LinkedIn](https://www.linkedin.com/in/caua-santos-069aa6390/)

> Os créditos foram mantidos para reconhecer a participação dos integrantes da equipe no desenvolvimento da solução.

## 🏆 Grand Prix de Inovação

Projeto desenvolvido durante o **Grand Prix de Inovação do SENAI**, dentro de uma dinâmica de desenvolvimento em equipe e apresentação de uma solução tecnológica para o problema proposto.

Durante a competição, a equipe trabalhou em diferentes frentes, incluindo:

- Prototipagem
- Modelagem
- Product Management
- Front-end
- Back-end
- Integração com IA
- Hospedagem na AWS

## 📌 Observação sobre este repositório

O projeto foi desenvolvido em equipe utilizando um computador disponibilizado durante a competição.

Por esse motivo, o histórico original de commits não representa necessariamente todos os integrantes que participaram do desenvolvimento.

Este repositório foi criado para **documentar minha participação no projeto e apresentá-lo como parte do meu portfólio**, mantendo os créditos dos demais integrantes da equipe.

---

**SENAI | Grand Prix de Inovação**
