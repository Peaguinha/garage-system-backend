const mongoose = require("mongoose");

/**
 * Conexão com o MongoDB.
 * Módulo compartilhado pelo grupo (base definida por Washingtton),
 * usado aqui apenas para permitir que os resolvers do GraphQL
 * e os testes de integração funcionem de ponta a ponta.
 */
async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/garage_system";

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri);

  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.connection.close();
}

module.exports = { connectDB, disconnectDB };
