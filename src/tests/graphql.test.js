require("./setup");
const request = require("supertest");
const { createApp } = require("../app");
const { seedCenarioCompleto } = require("./helpers");

let app;

beforeAll(async () => {
  const created = await createApp();
  app = created.app;
});

describe("GraphQL - Queries", () => {
  test("cliente autenticado consegue listar clientes", async () => {
    const { tokenMecanico } = await seedCenarioCompleto();

    const query = `query { clientes { id nome telefone } }`;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenMecanico}`)
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.clientes).toHaveLength(1);
    expect(res.body.data.clientes[0].nome).toBe("Maria Silva");
  });

  test("consulta composta: cliente -> veiculos -> ordensServico", async () => {
    const { tokenMecanico, cliente } = await seedCenarioCompleto();

    const query = `
      query ($id: ID!) {
        cliente(id: $id) {
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
    `;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenMecanico}`)
      .send({ query, variables: { id: cliente._id.toString() } });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    const clienteResp = res.body.data.cliente;
    expect(clienteResp.nome).toBe("Maria Silva");
    expect(clienteResp.veiculos).toHaveLength(1);
    expect(clienteResp.veiculos[0].placa).toBe("ABC1D23");
    expect(clienteResp.veiculos[0].ordensServico[0].status).toBe("ABERTA");
    expect(clienteResp.veiculos[0].ordensServico[0].valorTotal).toBe(190);
  });

  test("ordensServico aceita filtro por status", async () => {
    const { tokenMecanico } = await seedCenarioCompleto();

    const query = `
      query {
        ordensServico(status: ABERTA) {
          status
        }
        canceladas: ordensServico(status: CANCELADA) {
          status
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenMecanico}`)
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body.data.ordensServico).toHaveLength(1);
    expect(res.body.data.canceladas).toHaveLength(0);
  });

  test("veiculo(id) retorna dados do cliente associado", async () => {
    const { tokenMecanico, veiculo } = await seedCenarioCompleto();

    const query = `
      query ($id: ID!) {
        veiculo(id: $id) {
          placa
          cliente { nome cpf }
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenMecanico}`)
      .send({ query, variables: { id: veiculo._id.toString() } });

    expect(res.body.data.veiculo.cliente.nome).toBe("Maria Silva");
  });

  test("servicos e pecas retornam listas cadastradas", async () => {
    const { tokenMecanico } = await seedCenarioCompleto();

    const query = `query { servicos { nome valor } pecas { nome preco quantidadeDisponivel } }`;

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenMecanico}`)
      .send({ query });

    expect(res.body.data.servicos[0].nome).toBe("Troca de óleo");
    expect(res.body.data.pecas[0].quantidadeDisponivel).toBe(10);
  });
});
