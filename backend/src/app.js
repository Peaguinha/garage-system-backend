const express = require("express");
const cors = require("cors");
const { createApolloServer } = require("./graphql");

/**
 * Monta a aplicação Express com o endpoint /graphql.
 * Extraído em função separada (sem listen) para poder ser reutilizado
 * tanto pelo server.js quanto pelos testes automatizados.
 */
async function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const apolloServer = createApolloServer();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.get("/health", (req, res) => {
    res.json({ success: true, message: "Garage System API rodando" });
  });

  return { app, apolloServer };
}

module.exports = { createApp };
