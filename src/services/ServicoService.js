const ServicoRepository = require('../repositories/ServicoRepository');
const AppError = require('../utils/AppError');

class ServicoService {
    async criar({ nome, descricao, valor }) {
        if (!nome || !descricao) {
            throw new AppError('Nome e descrição são obrigatórios.');
        }

        if (valor === undefined || valor <= 0) {
            throw new AppError('O valor do serviço deve ser maior que zero.');
        }

        return ServicoRepository.criar({
            nome,
            descricao,
            valor,
        });
    }

    async listar() {
        return ServicoRepository.listarTodos();
    }

    async buscarPorId(id) {
        const servico = await ServicoRepository.buscarPorId(id);

        if (!servico) {
            throw new AppError('Serviço não encontrado.', 404);
        }

        return servico;
    }

    async atualizar(id, dados) {
        if (dados.valor !== undefined && dados.valor <= 0) {
            throw new AppError('O valor do serviço deve ser maior que zero.');
        }

        const servico = await ServicoRepository.atualizar(id, dados);

        if (!servico) {
            throw new AppError('Serviço não encontrado.', 404);
        }

        return servico;
    }

    async remover(id) {
        const servico = await ServicoRepository.remover(id);

        if (!servico) {
            throw new AppError('Serviço não encontrado.', 404);
        }

        return servico;
    }
}

module.exports = new ServicoService();