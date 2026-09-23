const Cliente = require("../models/Cliente");
const Veiculo = require("../models/Veiculo");
const Servico = require("../models/Servico");
const Peca = require("../models/Peca");
const OrdemServico = require("../models/OrdemServico");
const Usuario = require("../models/Usuario");

const {
  assertAutenticado,
  assertAutorizado,
} = require("../middlewares/auth");

const resolvers = {
  Query: {
    clientes: async (_, __, { user }) => {
      assertAutenticado(user);

      return Cliente.find().sort({ nome: 1 });
    },

    cliente: async (_, { id }, { user }) => {
      assertAutenticado(user);

      return Cliente.findById(id);
    },

    veiculos: async (_, __, { user }) => {
      assertAutenticado(user);

      return Veiculo.find().sort({ modelo: 1 });
    },

    veiculo: async (_, { id }, { user }) => {
      assertAutenticado(user);

      return Veiculo.findById(id);
    },

    servicos: async (_, __, { user }) => {
      assertAutenticado(user);

      return Servico.find().sort({ nome: 1 });
    },

    pecas: async (_, __, { user }) => {
      assertAutenticado(user);

      return Peca.find().sort({ nome: 1 });
    },

    ordensServico: async (_, { status }, { user }) => {
      assertAutenticado(user);

      const filtro = status ? { status } : {};

      return OrdemServico.find(filtro).sort({ createdAt: -1 });
    },

    ordemServico: async (_, { id }, { user }) => {
      assertAutenticado(user);

      return OrdemServico.findById(id);
    },

    usuarios: async (_, __, { user }) => {
      assertAutorizado(user, ["ADMIN"]);

      return Usuario.find().sort({ nome: 1 });
    },
  },

  Cliente: {
    id: (cliente) => cliente._id.toString(),

    veiculos: async (cliente) => {
      return Veiculo.find({
        clienteId: cliente._id,
      }).sort({ modelo: 1 });
    },
  },

  Veiculo: {
    id: (veiculo) => veiculo._id.toString(),

    cliente: async (veiculo) => {
      return Cliente.findById(veiculo.clienteId);
    },

    ordensServico: async (veiculo) => {
      return OrdemServico.find({
        veiculoId: veiculo._id,
      }).sort({ createdAt: -1 });
    },
  },

  Servico: {
    id: (servico) => servico._id.toString(),
  },

  Peca: {
    id: (peca) => peca._id.toString(),
  },

  Usuario: {
    id: (usuario) => usuario._id.toString(),
    role: (usuario) => usuario.role,
  },

  OrdemServico: {
    id: (ordem) => ordem._id.toString(),

    veiculo: async (ordem) => {
      return Veiculo.findById(ordem.veiculoId);
    },

    mecanico: async (ordem) => {
      return Usuario.findById(ordem.mecanicoId);
    },

    servicos: (ordem) => {
      return ordem.servicos || [];
    },

    pecas: (ordem) => {
      return ordem.pecas || [];
    },

    descricaoProblema: (ordem) => {
      return ordem.descricaoProblema;
    },

    dataAbertura: (ordem) => {
      return ordem.dataAbertura
        ? ordem.dataAbertura.toISOString()
        : null;
    },

    dataConclusao: (ordem) => {
      return ordem.dataConclusao
        ? ordem.dataConclusao.toISOString()
        : null;
    },

    createdAt: (ordem) => {
      return ordem.createdAt
        ? ordem.createdAt.toISOString()
        : null;
    },

    updatedAt: (ordem) => {
      return ordem.updatedAt
        ? ordem.updatedAt.toISOString()
        : null;
    },
  },

  ServicoOrdem: {
    servicoId: (servico) => servico.servicoId.toString(),
  },

  PecaOrdem: {
    pecaId: (peca) => peca.pecaId.toString(),
  },
};

module.exports = resolvers;