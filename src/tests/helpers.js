const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Cliente = require("../models/Cliente");
const Veiculo = require("../models/Veiculo");
const Servico = require("../models/Servico");
const Peca = require("../models/Peca");
const OrdemServico = require("../models/OrdemServico");
const { gerarToken } = require("../middlewares/auth");

async function criarUsuario({ nome = "Mecânico Teste", perfil = "MECANICO", email } = {}) {
  const senhaHash = await bcrypt.hash("senha123", 8);
  const usuario = await Usuario.create({
    nome,
    email: email || `${nome.toLowerCase().replace(/\s/g, ".")}@garage.com`,
    senhaHash,
    perfil,
  });
  const token = gerarToken(usuario);
  return { usuario, token };
}

async function seedCenarioCompleto() {
  const { usuario: admin, token: tokenAdmin } = await criarUsuario({ nome: "Admin Geral", perfil: "ADMIN" });
  const { usuario: mecanico, token: tokenMecanico } = await criarUsuario({ nome: "João Mecânico", perfil: "MECANICO" });

  const cliente = await Cliente.create({
    nome: "Maria Silva",
    telefone: "83999990000",
    cpf: "12345678900",
    email: "maria@email.com",
  });

  const veiculo = await Veiculo.create({
    placa: "ABC1D23",
    modelo: "Onix",
    marca: "Chevrolet",
    ano: 2020,
    clienteId: cliente._id,
  });

  const servico = await Servico.create({
    nome: "Troca de óleo",
    descricao: "Troca de óleo e filtro",
    valor: 150,
  });

  const peca = await Peca.create({
    nome: "Filtro de óleo",
    preco: 40,
    quantidadeDisponivel: 10,
  });

  const ordemServico = await OrdemServico.create({
    veiculoId: veiculo._id,
    mecanicoId: mecanico._id,
    problemaRelatado: "Barulho no motor",
    servicos: [servico._id],
    pecas: [peca._id],
    status: "ABERTA",
    valorTotal: 190,
  });

  return { admin, tokenAdmin, mecanico, tokenMecanico, cliente, veiculo, servico, peca, ordemServico };
}

module.exports = { criarUsuario, seedCenarioCompleto };
