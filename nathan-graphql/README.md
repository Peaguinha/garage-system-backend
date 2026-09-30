# Garage System — Parte de Nathan Esley (Fase 1 — Backend)

Responsabilidade: **GraphQL + Testes + Documentação das APIs**.

## O que está aqui

```
src/
├── graphql/
│   ├── typeDefs.js     # Schema GraphQL (types, enums, queries)
│   ├── resolvers.js    # Resolvers das queries e dos relacionamentos
│   └── index.js         # Configuração do Apollo Server (contexto/auth)
├── middlewares/
│   └── auth.js           # Extração/validação de JWT usada no contexto GraphQL
├── models/                # Modelos Mongoose (Cliente, Veículo, Serviço, Peça,
│                           # OrdemServico, Usuario) — versão mínima para permitir
│                           # que o schema e os testes rodem de forma independente
├── config/db.js           # Conexão com MongoDB
├── app.js / server.js     # Express + endpoint /graphql
├── tests/                 # Testes automatizados (Jest + Supertest)
└── docs/
    └── API_DOCUMENTATION.md   # Documentação das APIs REST + GraphQL
```

> Os models em `src/models/` seguem a modelagem descrita na divisão de
> atividades (responsabilidade de Washingtton). Foram incluídos aqui em
> versão simplificada apenas para que o schema GraphQL, os resolvers e os
> testes funcionem de ponta a ponta antes da integração final das branches.
> Ao integrar, usar os models definitivos do branch `feature/database`.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev        # inicia o servidor em http://localhost:4000/graphql
npm test           # roda toda a suíte de testes
```

## Principais queries GraphQL

- `clientes`, `cliente(id)`
- `veiculos`, `veiculo(id)`
- `servicos`
- `pecas`
- `ordensServico(status)`, `ordemServico(id)`
- `usuarios` (restrita a `ADMIN`)

Todas exigem `Authorization: Bearer <token>` no header, com o JWT emitido
pelo `POST /api/auth/login` (branch `feature/auth`, responsabilidade do Pedro).

Detalhes completos, exemplos de consulta e a documentação dos endpoints
REST dos demais módulos estão em `src/docs/API_DOCUMENTATION.md`.
