const Peca = require('../models/Peca');

class PecaRepository {
  async criar(dados) {
    return Peca.create(dados);
  }

  async listarTodos() {
    return Peca.find().sort({ createdAt: -1 });
  }

  async buscarPorId(id) {
    return Peca.findById(id);
  }

  async atualizar(id, dados) {
    return Peca.findByIdAndUpdate(id, dados, {
      new: true,
      runValidators: true,
    });
  }

  async remover(id) {
    return Peca.findByIdAndDelete(id);
  }

  /**
   * Usado pelo módulo de Ordens de Serviço (Integrante 5) para abater
   * estoque ao adicionar peças a uma ordem.
   */
  async decrementarQuantidade(id, quantidade) {
    return Peca.findOneAndUpdate(
      { _id: id, quantidadeDisponivel: { $gte: quantidade } },
      { $inc: { quantidadeDisponivel: -quantidade } },
      { new: true }
    );
  }
}

module.exports = new PecaRepository();
