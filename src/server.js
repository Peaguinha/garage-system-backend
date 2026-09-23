const express = require("express");
require("dotenv").config();

const connectDatabase = require("./config/database");
const authMiddleware = require("./middlewares/authMiddleware");
const roleMiddleware = require("./middlewares/roleMiddleware");
const authRoutes = require("./routes/authRoutes");
const servicosRoutes = require("./routes/servicos.routes");
const pecasRoutes = require("./routes/pecas.routes");

const clienteRoutes = require("./routes/clienteRoutes");
const veiculoRoutes = require("./routes/veiculoRoutes");
const ordemServicoRoutes = require("./routes/ordemServicoRoutes");
const { createApolloServer } = require("./graphql");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/clientes", clienteRoutes);
app.use("/api/veiculos", veiculoRoutes);
app.use("/api/ordens-servico", ordemServicoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/servicos", servicosRoutes);
app.use("/api/pecas", pecasRoutes);

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        service: "Garage System",
    });
});

// Rota protegida - autenticação
app.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Acesso autorizado",
        user: req.user
    });
});

// Rota protegida - autenticação + autorização
app.get(
    "/admin",
    authMiddleware,
    roleMiddleware("ADMIN"),
    (req, res) => {
        res.status(200).json({
            message: "Acesso autorizado",
            user: req.user
        });
    }
);

connectDatabase()
    .then(async () => {
        await createApolloServer(app);

        app.listen(PORT, () => {
            console.log(`Garage System is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Erro ao iniciar aplicação:", error);
        process.exit(1);
    });