const PecaRepository = require('../repositories/PecaRepository');
const AppError = require('../utils/AppError');

class PecaService {
    async criar({ nome, descricao, preco, quantidadeDisponivel }) {
        if (!nome) {
            throw new AppError('Nome da peça é obrigatório.');
        }

        if (preco === undefined || preco <= 0) {
            throw new AppError('O preço da peça deve ser maior que zero.');
        }

        if (
            quantidadeDisponivel !== undefined &&
            quantidadeDisponivel < 0
        ) {
            throw new AppError(
                'A quantidade disponível não pode ser negativa.'
            );
        }

        return PecaRepository.criar({
            nome,
            descricao,
            preco,
            quantidadeDisponivel: quantidadeDisponivel ?? 0,
        });
    }

    async listar() {
        return PecaRepository.listarTodos();
    }

    async buscarPorId(id) {
        const peca = await PecaRepository.buscarPorId(id);

        if (!peca) {
            throw new AppError('Peça não encontrada.', 404);
        }

        return peca;
    }

    async atualizar(id, dados) {
        if (dados.preco !== undefined && dados.preco <= 0) {
            throw new AppError('O preço da peça deve ser maior que zero.');
        }

        if (
            dados.quantidadeDisponivel !== undefined &&
            dados.quantidadeDisponivel < 0
        ) {
            throw new AppError(
                'A quantidade disponível não pode ser negativa.'
            );
        }

        const peca = await PecaRepository.atualizar(id, dados);

        if (!peca) {
            throw new AppError('Peça não encontrada.', 404);
        }

        return peca;
    }

    async remover(id) {
        const peca = await PecaRepository.remover(id);

        if (!peca) {
            throw new AppError('Peça não encontrada.', 404);
        }

        return peca;
    }
}

module.exports = new PecaService();