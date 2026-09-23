# 🚗 Garage System

Sistema de gerenciamento de oficina mecânica desenvolvido como projeto acadêmico, com foco na construção de um backend completo utilizando Node.js, Express, MongoDB, JWT e GraphQL — e, na Fase 2, de um frontend em React consumindo essa API.

O sistema permite o gerenciamento de clientes, veículos, serviços, peças e ordens de serviço, além de possuir autenticação, autorização por perfil e regras de negócio para o fluxo de atendimento da oficina.

---

## 📋 Sobre o projeto

O **Garage System** tem como objetivo centralizar o gerenciamento das operações de uma oficina mecânica.

O repositório é organizado como um **monorepo**, com dois projetos independentes lado a lado:

```text
garage-system/
├── backend/     Fase 1 — API REST + GraphQL, Node/Express/MongoDB (concluída)
└── frontend/    Fase 2 — Interface web em React (em desenvolvimento)
```

O backend disponibiliza duas formas de acesso aos dados:

- API RESTful;
- API GraphQL.

O sistema também possui autenticação baseada em JWT e controle de acesso através de perfis de usuário.

### Principais funcionalidades

- Cadastro e gerenciamento de usuários;
- Autenticação com JWT;
- Autorização por perfil;
- Cadastro de clientes;
- Cadastro de veículos;
- Cadastro de serviços;
- Cadastro de peças;
- Controle de estoque simplificado de peças;
- Criação e gerenciamento de ordens de serviço;
- Controle do fluxo de uma ordem de serviço;
- Cálculo do valor total da ordem;
- API RESTful;
- API GraphQL;
- Consultas relacionadas entre entidades;
- Persistência dos dados utilizando MongoDB;
- Interface web em React consumindo a API (Fase 2, em desenvolvimento).

---

# 🛠️ Tecnologias utilizadas

### Backend
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **JWT**
- **bcryptjs**
- **GraphQL**
- **Apollo Server**
- **dotenv**

### Frontend
- **React**
- **Vite**
- **React Router**
- **Context API** (estado de autenticação/tema)
- **CSS puro**, com os tokens de design extraídos do protótipo

### Geral
- **Git**
- **GitHub**

---

# 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada na separação de responsabilidades entre rotas, controllers, services, repositories e models, no backend, e uma camada de frontend em React que consome essa API pela borda.

Fluxo principal (backend):

```text
Cliente
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
MongoDB
```

Para autenticação e autorização:

```text
Request
   │
   ▼
JWT
   │
   ▼
Authentication Middleware
   │
   ▼
Authorization Middleware
   │
   ▼
Controller
```

O GraphQL funciona como uma camada adicional de acesso aos dados:

```text
                    CLIENTE
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
         REST API           GraphQL API
             │                   │
             └─────────┬─────────┘
                       ▼
                  Application
                       │
                       ▼
                    MongoDB
```

E o frontend (Fase 2) se encaixa como um consumidor da API REST, à frente de tudo isso:

```text
   Navegador
       │
       ▼
  React (SPA)
       │
       ▼
   REST API  ──────────── GraphQL API (usuários)
       │                       │
       └───────────┬───────────┘
                   ▼
              Application
                   │
                   ▼
                MongoDB
```

---

# 📁 Estrutura do projeto

```text
garage-system/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── graphql/
│       │   ├── index.js
│       │   ├── typeDefs.js
│       │   └── resolvers.js
│       ├── middlewares/
│       │   ├── auth.js
│       │   ├── authMiddleware.js
│       │   └── roleMiddleware.js
│       ├── models/
│       │   ├── Cliente.js
│       │   ├── Veiculo.js
│       │   ├── Servico.js
│       │   ├── Peca.js
│       │   ├── OrdemServico.js
│       │   └── Usuario.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── clienteRoutes.js
│       │   ├── veiculoRoutes.js
│       │   ├── servicos.routes.js
│       │   ├── pecas.routes.js
│       │   └── ordemServicoRoutes.js
│       ├── services/
│       ├── repositories/
│       └── server.js
│
└── frontend/
    └── src/
        ├── app/                 # rotas, layout (rail/topbar/bottom-nav), AuthContext
        ├── features/
        │   ├── auth/  dashboard/  clientes/  veiculos/
        │   └── ordens-servico/  servicos/  pecas/  usuarios/
        ├── shared/
        │   ├── components/      # Icon, RequireRole, FeaturePlaceholder...
        │   ├── api/              # cliente HTTP (client.js)
        │   ├── hooks/             # useAuth, useTheme
        │   └── styles/             # tokens.css + base.css, extraídos do protótipo
        └── main.jsx
```

Detalhe da estrutura do frontend em [🖥️ Frontend (Fase 2)](#-frontend-fase-2), mais abaixo.

---

# 🗄️ Banco de dados

O sistema utiliza **MongoDB** como banco de dados.

As principais coleções são:

```text
usuarios
clientes
veiculos
servicos
pecas
ordens_servico
```

---

# 🔗 Relacionamentos

A estrutura dos dados utiliza referências entre documentos.

### Cliente → Veículo

Um cliente pode possuir vários veículos.

```text
Cliente
   │
   ├── Veículo
   ├── Veículo
   └── Veículo
```

O veículo possui:

```text
clienteId
```

referenciando o cliente.

---

### Veículo → Ordem de Serviço

Um veículo pode possuir várias ordens de serviço.

```text
Veículo
   │
   ├── Ordem de Serviço
   ├── Ordem de Serviço
   └── Ordem de Serviço
```

A ordem possui:

```text
veiculoId
```

---

### Ordem de Serviço → Mecânico

A ordem de serviço possui um mecânico responsável:

```text
OrdemServico
      │
      └── mecanicoId
```

O identificador referencia um usuário com perfil:

```text
MECANICO
```

---

### Ordem de Serviço → Serviços

Uma ordem pode possuir diversos serviços:

```text
OrdemServico
      │
      ├── Serviço
      ├── Serviço
      └── Serviço
```

Os dados do serviço são armazenados na própria ordem para preservar o valor praticado no momento da execução.

---

### Ordem de Serviço → Peças

Uma ordem também pode utilizar várias peças:

```text
OrdemServico
      │
      ├── Peça
      ├── Peça
      └── Peça
```

A ordem armazena:

- Peça utilizada;
- Nome;
- Quantidade;
- Preço unitário.

Isso permite manter o histórico mesmo que o cadastro original da peça seja alterado posteriormente.

---

# 👤 Usuários e autenticação

O sistema utiliza três perfis:

```text
ADMIN
ATENDENTE
MECANICO
```

A autenticação utiliza:

```text
JWT
```

As senhas são armazenadas utilizando hash com:

```text
bcryptjs
```

---

# 🔐 Autenticação

## Login

```http
POST /api/auth/login
```

### Corpo

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}
```

### Resposta

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "usuario": {
      "id": "ID",
      "nome": "Administrador",
      "email": "admin@email.com",
      "role": "ADMIN"
    }
  },
  "message": "Login realizado com sucesso"
}
```

O token deve ser enviado nas rotas protegidas através do header:

```http
Authorization: Bearer JWT_TOKEN
```

---

# 👥 Clientes

Base URL:

```text
/api/clientes
```

## Criar cliente

```http
POST /api/clientes
```

Exemplo:

```json
{
  "nome": "João da Silva",
  "cpf": "12345678900",
  "telefone": "83999999999",
  "email": "joao@email.com",
  "endereco": "Rua Principal, 100"
}
```

---

## Listar clientes

```http
GET /api/clientes
```

---

## Buscar cliente

```http
GET /api/clientes/:id
```

---

## Atualizar cliente

```http
PUT /api/clientes/:id
```

---

## Excluir cliente

```http
DELETE /api/clientes/:id
```

---

# 🚗 Veículos

Base URL:

```text
/api/veiculos
```

## Criar veículo

```http
POST /api/veiculos
```

Exemplo:

```json
{
  "placa": "ABC1D23",
  "modelo": "Civic",
  "marca": "Honda",
  "ano": 2022,
  "cor": "Preto",
  "clienteId": "ID_DO_CLIENTE"
}
```

---

## Listar veículos

```http
GET /api/veiculos
```

---

## Buscar veículo

```http
GET /api/veiculos/:id
```

---

## Atualizar veículo

```http
PUT /api/veiculos/:id
```

---

## Excluir veículo

```http
DELETE /api/veiculos/:id
```

---

# 🔧 Serviços

Base URL:

```text
/api/servicos
```

## Criar serviço

```http
POST /api/servicos
```

Exemplo:

```json
{
  "nome": "Troca de óleo",
  "descricao": "Troca de óleo e filtro",
  "valor": 150
}
```

### Resposta

```json
{
  "success": true,
  "data": {
    "nome": "Troca de óleo",
    "descricao": "Troca de óleo e filtro",
    "valor": 150
  },
  "message": "Serviço cadastrado com sucesso."
}
```

---

## Listar serviços

```http
GET /api/servicos
```

---

## Buscar serviço

```http
GET /api/servicos/:id
```

---

## Atualizar serviço

```http
PUT /api/servicos/:id
```

---

## Excluir serviço

```http
DELETE /api/servicos/:id
```

---

# 🔩 Peças

Base URL:

```text
/api/pecas
```

## Criar peça

```http
POST /api/pecas
```

Exemplo:

```json
{
  "nome": "Filtro de óleo",
  "codigo": "FLT001",
  "fabricante": "Bosch",
  "preco": 45,
  "quantidadeDisponivel": 10
}
```

---

## Listar peças

```http
GET /api/pecas
```

---

## Buscar peça

```http
GET /api/pecas/:id
```

---

## Atualizar peça

```http
PUT /api/pecas/:id
```

---

## Excluir peça

```http
DELETE /api/pecas/:id
```

---

# 🧾 Ordens de Serviço

Base URL:

```text
/api/ordens-servico
```

A Ordem de Serviço é o principal módulo do sistema.

Ela relaciona:

```text
Cliente
   │
   ▼
Veículo
   │
   ▼
Ordem de Serviço
   │
   ├── Mecânico
   ├── Serviços
   └── Peças
```

---

## Criar ordem de serviço

```http
POST /api/ordens-servico
```

Exemplo:

```json
{
  "veiculoId": "ID_DO_VEICULO",
  "mecanicoId": "ID_DO_MECANICO",
  "descricaoProblema": "Veículo apresenta ruído anormal no motor"
}
```

---

## Listar ordens

```http
GET /api/ordens-servico
```

---

## Buscar ordem

```http
GET /api/ordens-servico/:id
```

---

## Atualizar ordem

```http
PUT /api/ordens-servico/:id
```

---

## Excluir ordem

```http
DELETE /api/ordens-servico/:id
```

---

# 🔄 Status da Ordem de Serviço

A ordem utiliza os seguintes estados:

```text
ABERTA
EM_DIAGNOSTICO
AGUARDANDO_APROVACAO
EM_EXECUCAO
CONCLUIDA
CANCELADA
```

O fluxo segue uma sequência controlada:

```text
ABERTA
   ↓
EM_DIAGNOSTICO
   ↓
AGUARDANDO_APROVACAO
   ↓
EM_EXECUCAO
   ↓
CONCLUIDA
```

Também existe a possibilidade de:

```text
ABERTA
   ↓
CANCELADA
```

As transições são controladas pelas regras de negócio da aplicação.

---

# 💰 Cálculo da Ordem de Serviço

O valor total da ordem considera:

```text
Serviços
    +
Peças
    =
Valor Total
```

Exemplo:

```text
Troca de óleo       R$ 150,00
Filtro de óleo      R$  45,00
                    ──────────
Total               R$ 195,00
```

Os serviços e peças utilizados na ordem possuem seus valores registrados no momento da utilização.

---

# 📡 GraphQL

O projeto também disponibiliza uma API GraphQL.

Endpoint:

```text
/graphql
```

A API utiliza:

```text
Apollo Server
```

---

# 🔐 Autenticação no GraphQL

As operações protegidas exigem o mesmo JWT utilizado na API REST.

Header:

```http
Authorization: Bearer JWT_TOKEN
```

Sem um token válido, a API retorna:

```json
{
  "errors": [
    {
      "message": "Não autenticado. Informe um token JWT válido."
    }
  ]
}
```

---

# 🔎 Queries GraphQL

## Listar clientes

```graphql
query {
  clientes {
    id
    nome
    telefone
    email
    cpf
  }
}
```

---

## Buscar cliente

```graphql
query {
  cliente(id: "ID_DO_CLIENTE") {
    id
    nome
    telefone
    email
  }
}
```

---

# 🚗 Clientes e veículos

O GraphQL permite realizar consultas relacionadas.

```graphql
query {
  clientes {
    id
    nome

    veiculos {
      id
      placa
      modelo
      marca
      ano
    }
  }
}
```

Isso permite consultar o cliente e seus veículos em uma única operação.

---

# 🔧 Listar serviços

```graphql
query {
  servicos {
    id
    nome
    descricao
    valor
    tempoEstimado
  }
}
```

---

# 🔩 Listar peças

```graphql
query {
  pecas {
    id
    nome
    codigo
    fabricante
    preco
    quantidadeDisponivel
  }
}
```

---

# 📋 Listar Ordens de Serviço

```graphql
query {
  ordensServico {
    id
    descricaoProblema
    diagnostico
    status
    valorTotal
    dataAbertura
    dataConclusao
  }
}
```

---

# 🔍 Filtrar Ordens por status

```graphql
query {
  ordensServico(status: CONCLUIDA) {
    id
    descricaoProblema
    status
    valorTotal
  }
}
```

---

# 🧾 Buscar Ordem de Serviço

```graphql
query {
  ordemServico(id: "ID_DA_ORDEM") {
    id
    descricaoProblema
    diagnostico
    status
    valorTotal
  }
}
```

---

# 🔗 Consulta composta

Uma das principais funcionalidades do GraphQL é consultar informações relacionadas em uma única operação.

Exemplo:

```graphql
query {
  cliente(id: "ID_DO_CLIENTE") {
    id
    nome
    telefone

    veiculos {
      id
      placa
      modelo
      marca

      ordensServico {
        id
        descricaoProblema
        status
        valorTotal
      }
    }
  }
}
```

O resultado permite obter:

```text
Cliente
   │
   ├── Veículos
   │      │
   │      └── Ordens de Serviço
   │
   └── Histórico de atendimento
```

---

# 👤 Usuários

A consulta de usuários é restrita ao perfil `ADMIN`.

```graphql
query {
  usuarios {
    id
    nome
    email
    role
  }
}
```

> ⚠️ Não existe rota REST equivalente para usuários — só GraphQL. É um ponto em aberto para a Fase 2 (ver seção do frontend, abaixo).

---

# 🧠 Regras de negócio

O sistema possui diversas validações.

### Clientes

- CPF obrigatório;
- CPF único;
- Nome obrigatório;
- Telefone obrigatório.

### Veículos

- Placa obrigatória;
- Placa única;
- Veículo deve possuir cliente;
- Cliente deve existir.

### Serviços

- Nome obrigatório;
- Valor obrigatório;
- Valor deve ser maior que zero.

### Peças

- Nome obrigatório;
- Preço maior que zero;
- Quantidade disponível não pode ser negativa.

### Ordens de Serviço

- Veículo deve existir;
- Mecânico deve existir;
- Serviços devem existir;
- Peças devem existir;
- Quantidade de peças deve respeitar o estoque;
- Valor total deve ser calculado;
- Status deve respeitar o fluxo definido;
- Data de conclusão deve ser registrada quando a ordem for concluída.

---

# 🧪 Testes

Durante o desenvolvimento da Fase 1 foram realizados testes envolvendo:

- Login;
- Geração de JWT;
- Autenticação;
- Autorização;
- CRUD de clientes;
- CRUD de veículos;
- CRUD de serviços;
- CRUD de peças;
- Ordens de serviço;
- Regras de negócio;
- Integração com MongoDB;
- Queries GraphQL;
- Consultas relacionadas;
- Controle de acesso no GraphQL.

---

# 🖥️ Frontend (Fase 2)

Interface web em **React + Vite**, consumindo a API REST documentada acima. Vive em [`frontend/`](frontend).

### Por que essa stack

| Camada | Escolha | Por quê |
|---|---|---|
| Build tool | Vite | Setup rápido, HMR, padrão de mercado para SPA React |
| Estado | Context API + hooks (sem Redux) | Estado simples o suficiente — `AuthContext` + estado local por feature |
| Estilo | CSS puro, tokens extraídos do protótipo | A identidade visual já estava pronta no protótipo V2; reaproveitar em vez de recriar em outro framework |
| Dados | REST (ver endpoints acima) | Mais simples de consumir por feature, de forma independente |
| Roteamento | React Router | Padrão para SPAs com múltiplas telas |
| Lint/format | oxlint + Prettier | `create-vite` já vem com oxlint (Rust, rápido) |

### Parâmetro visual

O frontend segue como referência de tela e identidade visual o protótipo estático `garage-system-Prototipo/V2-GarageSystem.html` (fora deste repositório, no hub do projeto). Os tokens de cor/tipografia e as classes de componente desse protótipo foram extraídos para `frontend/src/shared/styles/`.

### Estrutura

```text
frontend/
├── src/
│   ├── app/
│   │   ├── AppRoutes.jsx      # todas as rotas da aplicação
│   │   ├── AppLayout.jsx      # rail (desktop) / drawer + bottom-nav (mobile)
│   │   ├── AuthContext.jsx    # login real (POST /api/auth/login), token, sessão
│   │   ├── RequireAuth.jsx    # guarda de rota: sem sessão → /login
│   │   └── navConfig.js       # itens do menu principal
│   ├── features/
│   │   ├── auth/               # LoginPage — implementado
│   │   ├── dashboard/           # placeholder
│   │   ├── clientes/            # placeholder
│   │   ├── veiculos/            # placeholder
│   │   ├── ordens-servico/      # placeholder (lista/kanban + detalhe)
│   │   ├── servicos/            # placeholder
│   │   ├── pecas/               # placeholder
│   │   └── usuarios/            # placeholder + guarda de papel (ADMIN)
│   └── shared/
│       ├── components/         # Icon, IconSprite, RequireRole, FeaturePlaceholder
│       ├── api/                 # client.js — cliente fetch único (baseURL + JWT)
│       ├── hooks/                # useAuth, useTheme
│       └── styles/                # tokens.css + base.css (extraídos do protótipo)
└── main.jsx
```

**Regra de ouro:** um componente usado por mais de uma feature vai para `shared/components/`, nunca duplicado dentro de cada `features/<nome>/`.

### Autenticação no frontend

O `AuthContext` chama `POST /api/auth/login` de verdade (mesmo contrato documentado em [🔐 Autenticação](#-autenticação)), guarda o token em memória + `localStorage`, e injeta o header `Authorization: Bearer <token>` em toda chamada feita através de `shared/api/client.js`. Rotas sem sessão redirecionam para `/login`; telas/ações restritas a um papel usam `<RequireRole roles={[...]}>` ou o helper `can(role, roles)`, espelhando o `roleMiddleware` do backend.

### Exceção: tela de Usuários

Como não existe rota REST para usuários (só GraphQL — ver aviso acima), quem pegar essa feature decide entre adicionar `GET /api/usuarios` (ADMIN-only) no backend ou consumir GraphQL só nessa tela.

### Features e responsáveis

Atribuição sugerida com base em quem construiu o módulo equivalente no backend na Fase 1 — ajustável pela equipe.

| # | Feature | Endpoints | Responsável | Status |
|---|---|---|---|---|
| F1 | Autenticação & Shell | `POST /api/auth/login` | Pedro Henrique | ✅ Pronto |
| F2 | Dashboard | `GET /api/ordens-servico`, `GET /api/pecas` | Washingtton Lucena | ⏳ Placeholder |
| F3 | Clientes & Veículos | `/api/clientes`, `/api/veiculos` | Igor Araújo | ⏳ Placeholder |
| F4 | Ordens de Serviço | `/api/ordens-servico` | Kaik | ⏳ Placeholder |
| F5 | Serviços & Peças | `/api/servicos`, `/api/pecas` | Israel Neto | ⏳ Placeholder |
| F6 | Usuários | GraphQL `usuarios` (ou nova rota REST) | Nathan Esley | ⏳ Placeholder |

Detalhe completo do plano (critérios de pronto, fluxo de contribuição): documento **Garage System - Fase 2 Frontend.md**, no hub do projeto no Obsidian.

---

# ⚙️ Como executar

## 1. Clonar o projeto

```bash
git clone https://github.com/Peaguinha/garage-system.git
cd garage-system
```

## 2. Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` (exemplo):

```env
PORT=3000
MONGODB_URI=sua_connection_string
JWT_SECRET=sua_chave_secreta
```

```bash
npm run dev
```

O servidor será iniciado em:

```text
http://localhost:3000
```

## 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação será iniciada em:

```text
http://localhost:5173
```

Precisa do backend rodando em paralelo para o login e as chamadas de API funcionarem.

---

# ❤️ Health Check

Para verificar se a aplicação está funcionando:

```http
GET /health
```

Resposta:

```json
{
  "status": "OK",
  "service": "Garage System"
}
```

---

# 🌿 Git e branches

O desenvolvimento foi organizado utilizando branches.

Estrutura:

```text
main
│
└── develop
    │
    ├── feature/auth
    ├── feature/database
    ├── feature/clientes-veiculos
    ├── feature/servicos-pecas
    ├── feature/ordens-servico
    ├── feature/graphql
    │
    ├── chore/monorepo-restructure         (Fase 2 — backend/ + frontend/)
    ├── feature/frontend-auth-shell
    ├── feature/frontend-dashboard
    ├── feature/frontend-clientes-veiculos
    ├── feature/frontend-ordens-servico
    ├── feature/frontend-servicos-pecas
    └── feature/frontend-usuarios
```

Fluxo utilizado:

```text
Feature
   ↓
Commit
   ↓
Pull Request
   ↓
develop
   ↓
Testes
   ↓
main
```

A branch `main` representa a versão estável do projeto.

A branch `develop` concentra o desenvolvimento e integração das funcionalidades.

---

# 📊 Visão geral da aplicação

```text
                         GARAGE SYSTEM
                              │
                              ▼
                       ┌─────────────┐
                       │  REACT (SPA) │
                       └──────┬──────┘
                              │
                       ┌─────────────┐
                       │    LOGIN    │
                       └──────┬──────┘
                              │
                             JWT
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
         REST API                         GraphQL
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                         APPLICATION
                              │
                              ▼
                           MongoDB
                              │
          ┌──────────┬────────┼─────────┬──────────┐
          │          │        │         │          │
      Clientes   Veículos  Serviços   Peças    Usuários
          │          │        │         │
          └──────────┴────────┴─────────┘
                       │
                       ▼
                Ordens de Serviço
                       │
                  ┌────┴────┐
                  ▼         ▼
              Serviços    Peças
                  │         │
                  └────┬────┘
                       ▼
                 Valor Total
                       │
                       ▼
                   CONCLUÍDA
```

---

# 🚀 Resultado

Ao final da Fase 1, o Garage System possuía um backend funcional para gerenciamento de uma oficina mecânica.

A aplicação conta com:

- Backend Node.js;
- Express;
- MongoDB;
- Mongoose;
- JWT;
- bcryptjs;
- Controle de acesso por perfil;
- API RESTful;
- API GraphQL;
- Clientes;
- Veículos;
- Serviços;
- Peças;
- Ordens de Serviço;
- Regras de negócio;
- Relacionamentos entre entidades;
- Persistência de dados;
- Estrutura organizada para evolução futura.

Na Fase 2, o projeto virou um monorepo (`backend/` + `frontend/`) e ganhou o esqueleto funcional do frontend em React: login real, layout responsivo, roteamento protegido por sessão e por papel, e a identidade visual do protótipo já reaproveitada em CSS — pronto para as 6 features do time preencherem o conteúdo de cada tela.

---

## 👨‍💻 Equipe

Projeto desenvolvido por:

- Pedro Henrique de Almeida Peixoto
- Washingtton Lucena Bandeira Filho
- Igor Araújo
- Israel Neto
- Kaik
- Nathan Esley

---

## 📄 Status do projeto

**Fase 1 — Backend + Banco de Dados**

```text
🟢 Concluída
```

Principais componentes implementados:

```text
✅ Backend
✅ MongoDB
✅ REST API
✅ JWT
✅ Autorização
✅ Clientes
✅ Veículos
✅ Serviços
✅ Peças
✅ Ordens de Serviço
✅ Regras de negócio
✅ GraphQL
```

**Fase 2 — Frontend em React**

```text
🟡 Em andamento
```

Principais componentes:

```text
✅ Monorepo (backend/ + frontend/)
✅ Scaffold Vite + React
✅ Tokens visuais extraídos do protótipo
✅ Autenticação & Shell (F1)
⬜ Dashboard (F2)
⬜ Clientes & Veículos (F3)
⬜ Ordens de Serviço (F4)
⬜ Serviços & Peças (F5)
⬜ Usuários (F6)
```
