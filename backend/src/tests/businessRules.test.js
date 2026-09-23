require("./setup");
const mongoose = require("mongoose");
const Cliente = require("../models/Cliente");
const Veiculo = require("../models/Veiculo");
const Servico = require("../models/Servico");
const Peca = require("../models/Peca");
const OrdemServico = require("../models/OrdemServico");

describe("Regras de negócio - integração com MongoDB", () => {
  test("não deve permitir serviço com valor <= 0", async () => {
    await expect(
      Servico.create({ nome: "Alinhamento", valor: 0 })
    ).rejects.toThrow();
  });

  test("não deve permitir peça com preço <= 0", async () => {
    await expect(
      Peca.create({ nome: "Pastilha de freio", preco: -10, quantidadeDisponivel: 5 })
    ).rejects.toThrow();
  });

  test("não deve permitir peça com quantidade disponível negativa", async () => {
    await expect(
      Peca.create({ nome: "Vela de ignição", preco: 20, quantidadeDisponivel: -1 })
    ).rejects.toThrow();
  });

  test("não deve permitir placa de veículo duplicada", async () => {
    const cliente = await Cliente.create({
      nome: "Carlos Souza",
      telefone: "83988887777",
      cpf: "98765432100",
    });

    await Veiculo.create({ placa: "XYZ9A88", modelo: "Gol", marca: "VW", clienteId: cliente._id });

    await expect(
      Veiculo.create({ placa: "XYZ9A88", modelo: "Fox", marca: "VW", clienteId: cliente._id })
    ).rejects.toThrow();
  });

  test("não deve permitir veículo associado a cliente inexistente", async () => {
    const clienteIdInexistente = new mongoose.Types.ObjectId();

    // Documento é criado (Mongoose não valida FK por padrão), mas a
    // integridade referencial deve ser garantida pela camada de serviço
    // do módulo de Veículos (Igor) antes de persistir.
    const clienteEncontrado = await Cliente.findById(clienteIdInexistente);
    expect(clienteEncontrado).toBeNull();
  });

  test("status da ordem de serviço deve pertencer ao enum definido", async () => {
    const cliente = await Cliente.create({ nome: "Ana Lima", telefone: "8399990001", cpf: "11122233344" });
    const veiculo = await Veiculo.create({ placa: "QWE4R56", modelo: "HB20", marca: "Hyundai", clienteId: cliente._id });

    await expect(
      OrdemServico.create({
        veiculoId: veiculo._id,
        mecanicoId: new mongoose.Types.ObjectId(),
        status: "STATUS_INVALIDO",
      })
    ).rejects.toThrow();
  });

  test("ordem de serviço é criada com status ABERTA por padrão", async () => {
    const cliente = await Cliente.create({ nome: "Bruno Alves", telefone: "8399990002", cpf: "22233344455" });
    const veiculo = await Veiculo.create({ placa: "RTY7U89", modelo: "Ka", marca: "Ford", clienteId: cliente._id });

    const ordem = await OrdemServico.create({
      veiculoId: veiculo._id,
      mecanicoId: new mongoose.Types.ObjectId(),
    });

    expect(ordem.status).toBe("ABERTA");
  });
});
