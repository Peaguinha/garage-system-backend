# 🚗 Garage System

Sistema de gerenciamento de oficina mecânica desenvolvido como projeto acadêmico, com foco na construção de um backend completo utilizando Node.js, Express, MongoDB, JWT e GraphQL.

O sistema permite o gerenciamento de clientes, veículos, serviços, peças e ordens de serviço, além de possuir autenticação, autorização por perfil e regras de negócio para o fluxo de atendimento da oficina.

---

## 📋 Sobre o projeto

O **Garage System** tem como objetivo centralizar o gerenciamento das operações de uma oficina mecânica.

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
- Persistência dos dados utilizando MongoDB.

---

# 🛠️ Tecnologias utilizadas

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **JWT**
- **bcryptjs**
- **GraphQL**
- **Apollo Server**
- **dotenv**
- **Git**
- **GitHub**

---

# 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada na separação de responsabilidades entre rotas, controllers, services, repositories e models.

Fluxo principal:

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

---

# 📁 Estrutura do projeto

A estrutura principal do backend é organizada da seguinte maneira:

```text
src/
├── config/
│
├── controllers/
│
├── graphql/
│   ├── index.js
│   ├── typeDefs.js
│   └── resolvers.js
│
├── middlewares/
│   ├── auth.js
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── Cliente.js
│   ├── Veiculo.js
│   ├── Servico.js
│   ├── Peca.js
│   ├── OrdemServico.js
│   └── Usuario.js
│
├── routes/
│   ├── authRoutes.js
│   ├── clienteRoutes.js
│   ├── veiculoRoutes.js
│   ├── servicos.routes.js
│   ├── pecas.routes.js
│   └── ordemServicoRoutes.js
│
├── services/
│
├── repositories/
│
└── server.js
```

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

Durante o desenvolvimento foram realizados testes envolvendo:

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

# ⚙️ Como executar

## 1. Clonar o projeto

```bash
git clone https://github.com/Peaguinha/garage-system.git
```

## 2. Entrar na pasta

```bash
cd garage-system
```

## 3. Instalar dependências

```bash
npm install
```

## 4. Configurar variáveis de ambiente

Crie um arquivo:

```text
.env
```

Exemplo:

```env
PORT=3000
MONGODB_URI=sua_connection_string
JWT_SECRET=sua_chave_secreta
```

## 5. Executar

```bash
npm run dev
```

O servidor será iniciado em:

```text
http://localhost:3000
```

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
    └── feature/graphql
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

Ao final da Fase 1, o Garage System possui um backend funcional para gerenciamento de uma oficina mecânica.

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

O projeto também estabelece a base para uma futura camada frontend, que poderá consumir as APIs desenvolvidas nesta etapa.

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
