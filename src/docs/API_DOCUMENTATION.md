# Documentação das APIs — Garage System (Fase 1)

> Documentação elaborada por **Nathan Esley** (GraphQL, Testes e Documentação das APIs),
> cobrindo os endpoints REST implementados pelos demais integrantes e a API GraphQL.

## Autenticação

Todas as rotas (REST e GraphQL) exigem um token JWT, exceto o login.

**Header exigido:**
```
Authorization: Bearer <token>
```

### POST /api/auth/login

| Campo | Tipo | Obrigatório |
|---|---|---|
| email | string | sim |
| senha | string | sim |

**Resposta (200):**
```json
{
  "success": true,
  "data": { "token": "eyJhbGciOi..." },
  "message": "Operação realizada com sucesso"
}
```

**Erros:** `401` credenciais inválidas.

---

## APIs REST

### Clientes

| Método | Rota | Descrição | Perfil mínimo |
|---|---|---|---|
| POST | `/api/clientes` | Cadastra cliente | ATENDENTE |
| GET | `/api/clientes` | Lista clientes | ATENDENTE |
| GET | `/api/clientes/:id` | Consulta por ID | ATENDENTE |
| PUT | `/api/clientes/:id` | Atualiza cliente | ATENDENTE |
| DELETE | `/api/clientes/:id` | Remove cliente | ADMIN |

**Corpo (POST/PUT):**
```json
{ "nome": "Maria Silva", "telefone": "83999990000", "cpf": "12345678900", "email": "maria@email.com" }
```

**Erros comuns:** `400` dados obrigatórios ausentes/CPF duplicado · `404` cliente não encontrado.

### Veículos

| Método | Rota | Descrição | Perfil mínimo |
|---|---|---|---|
| POST | `/api/veiculos` | Cadastra veículo (associado a um cliente) | ATENDENTE |
| GET | `/api/veiculos` | Lista veículos | ATENDENTE |
| GET | `/api/veiculos/:id` | Consulta por ID | ATENDENTE |
| PUT | `/api/veiculos/:id` | Atualiza veículo | ATENDENTE |
| DELETE | `/api/veiculos/:id` | Remove veículo | ADMIN |

**Regras:** placa única; `clienteId` deve existir; retorna `400` caso contrário.

### Serviços

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/servicos` | Cadastra serviço (`valor > 0`) |
| GET | `/api/servicos` | Lista serviços |
| GET | `/api/servicos/:id` | Consulta por ID |
| PUT | `/api/servicos/:id` | Atualiza serviço |
| DELETE | `/api/servicos/:id` | Remove serviço |

### Peças

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/pecas` | Cadastra peça (`preco > 0`, `quantidadeDisponivel >= 0`) |
| GET | `/api/pecas` | Lista peças |
| GET | `/api/pecas/:id` | Consulta por ID |
| PUT | `/api/pecas/:id` | Atualiza peça |
| DELETE | `/api/pecas/:id` | Remove peça |

### Ordens de Serviço

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/ordens-servico` | Abre ordem de serviço |
| GET | `/api/ordens-servico` | Lista ordens |
| GET | `/api/ordens-servico/:id` | Consulta detalhada |
| PUT | `/api/ordens-servico/:id` | Atualiza (status, diagnóstico, peças, serviços) |
| DELETE | `/api/ordens-servico/:id` | Cancela/remove ordem |

**Status possíveis:** `ABERTA → EM_DIAGNOSTICO → AGUARDANDO_APROVACAO → EM_EXECUCAO → CONCLUIDA` (ou `CANCELADA` a qualquer momento).

**Regras de negócio:**
- Veículo, mecânico, serviços e peças informados devem existir.
- Transições de status seguem a ordem definida acima.
- `valorTotal` é calculado a partir da soma dos serviços e peças vinculados.
- Quantidade disponível da peça é validada antes da baixa no estoque.

---

## API GraphQL

**Endpoint único:** `POST /graphql`

### Schema (resumo)

```graphql
type Query {
  clientes: [Cliente!]!
  cliente(id: ID!): Cliente
  veiculos: [Veiculo!]!
  veiculo(id: ID!): Veiculo
  servicos: [Servico!]!
  pecas: [Peca!]!
  ordensServico(status: StatusOrdemServico): [OrdemServico!]!
  ordemServico(id: ID!): OrdemServico
  usuarios: [Usuario!]!   # restrito a ADMIN
}
```

### Exemplo — consulta simples

```graphql
query {
  clientes {
    id
    nome
    telefone
  }
}
```

### Exemplo — consulta composta (cliente → veículos → ordens de serviço)

```graphql
query {
  cliente(id: "123") {
    nome
    telefone
    veiculos {
      placa
      modelo
      ordensServico {
        status
        valorTotal
      }
    }
  }
}
```

### Exemplo — filtrando ordens por status

```graphql
query {
  ordensServico(status: EM_EXECUCAO) {
    id
    status
    valorTotal
  }
}
```

### Códigos de erro GraphQL

| Código | Situação |
|---|---|
| `UNAUTHENTICATED` | Token ausente, inválido ou expirado |
| `FORBIDDEN` | Usuário autenticado sem permissão para a operação |
| `INTERNAL_SERVER_ERROR` | Erro inesperado no servidor |

---

## Padrão de resposta (REST)

**Sucesso:**
```json
{ "success": true, "data": {}, "message": "Operação realizada com sucesso" }
```

**Erro:**
```json
{ "success": false, "message": "Recurso não encontrado" }
```

---

## Testes automatizados

Local: `src/tests/`

| Arquivo | Cobertura |
|---|---|
| `graphql.test.js` | Queries GraphQL (clientes, veículos, ordens de serviço, consultas compostas) |
| `auth.test.js` | Autenticação (token ausente/inválido/expirado) e autorização por perfil |
| `businessRules.test.js` | Regras de negócio (valores > 0, placa única, status válido) e integração com MongoDB |

**Execução:**
```bash
npm install
npm test
```

Os testes usam `mongodb-memory-server`, então não é necessário um MongoDB real rodando localmente.
