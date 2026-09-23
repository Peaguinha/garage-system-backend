const Servico = require('../models/Servico');

class ServicoRepository {
  async criar(dados) {
    return Servico.create(dados);
  }

  async listarTodos() {
    return Servico.find().sort({ createdAt: -1 });
  }

  async buscarPorId(id) {
    return Servico.findById(id);
  }

  async atualizar(id, dados) {
    return Servico.findByIdAndUpdate(id, dados, {
      new: true,
      runValidators: true,
    });
  }

  async remover(id) {
    return Servico.findByIdAndDelete(id);
  }
}

module.exports = new ServicoRepository();
