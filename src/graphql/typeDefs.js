const typeDefs = `
  enum Role {
    ADMIN
    ATENDENTE
    MECANICO
  }

  enum StatusOrdemServico {
    ABERTA
    EM_DIAGNOSTICO
    AGUARDANDO_APROVACAO
    EM_EXECUCAO
    CONCLUIDA
    CANCELADA
  }

  type Usuario {
    id: ID!
    nome: String!
    email: String!
    role: Role!
  }

  type Cliente {
    id: ID!
    nome: String!
    telefone: String!
    email: String
    cpf: String!
    endereco: String
    veiculos: [Veiculo!]!
  }

  type Veiculo {
    id: ID!
    placa: String!
    modelo: String!
    marca: String!
    ano: Int
    cor: String
    cliente: Cliente
    ordensServico: [OrdemServico!]!
  }

  type Servico {
    id: ID!
    nome: String!
    descricao: String
    valor: Float!
    tempoEstimado: Int
  }

  type Peca {
    id: ID!
    nome: String!
    codigo: String
    fabricante: String
    preco: Float!
    quantidadeDisponivel: Int!
  }

  type ServicoOrdem {
    servicoId: ID!
    nome: String!
    valor: Float!
  }

  type PecaOrdem {
    pecaId: ID!
    nome: String!
    quantidade: Float!
    precoUnitario: Float!
  }

  type OrdemServico {
    id: ID!
    veiculo: Veiculo!
    mecanico: Usuario!
    descricaoProblema: String!
    diagnostico: String
    status: StatusOrdemServico!
    servicos: [ServicoOrdem!]!
    pecas: [PecaOrdem!]!
    valorTotal: Float!
    dataAbertura: String
    dataConclusao: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    clientes: [Cliente!]!
    cliente(id: ID!): Cliente

    veiculos: [Veiculo!]!
    veiculo(id: ID!): Veiculo

    servicos: [Servico!]!

    pecas: [Peca!]!

    ordensServico(status: StatusOrdemServico): [OrdemServico!]!
    ordemServico(id: ID!): OrdemServico

    usuarios: [Usuario!]!
  }
`;

module.exports = typeDefs;