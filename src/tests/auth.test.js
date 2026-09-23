require("./setup");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { createApp } = require("../app");
const { seedCenarioCompleto } = require("./helpers");
const { JWT_SECRET } = require("../middlewares/auth");

let app;

beforeAll(async () => {
  const created = await createApp();
  app = created.app;
});

describe("GraphQL - Autenticação e Autorização", () => {
  test("query sem token retorna erro UNAUTHENTICATED", async () => {
    await seedCenarioCompleto();

    const res = await request(app)
      .post("/graphql")
      .send({ query: "{ clientes { id } }" });

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].code).toBe("UNAUTHENTICATED");
  });

  test("token inválido é tratado como não autenticado", async () => {
    await seedCenarioCompleto();

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", "Bearer token.invalido.aqui")
      .send({ query: "{ clientes { id } }" });

    expect(res.body.errors[0].code).toBe("UNAUTHENTICATED");
  });

  test("token expirado é rejeitado", async () => {
    const tokenExpirado = jwt.sign({ id: "1", perfil: "MECANICO" }, JWT_SECRET, { expiresIn: "-10s" });

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenExpirado}`)
      .send({ query: "{ clientes { id } }" });

    expect(res.body.errors[0].code).toBe("UNAUTHENTICATED");
  });

  test("query 'usuarios' exige perfil ADMIN", async () => {
    const { tokenMecanico } = await seedCenarioCompleto();

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenMecanico}`)
      .send({ query: "{ usuarios { nome perfil } }" });

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].code).toBe("FORBIDDEN");
  });

  test("ADMIN consegue consultar 'usuarios'", async () => {
    const { tokenAdmin } = await seedCenarioCompleto();

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ query: "{ usuarios { nome perfil } }" });

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.usuarios.length).toBeGreaterThanOrEqual(2);
  });
});
