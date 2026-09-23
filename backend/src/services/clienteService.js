const clienteRepository = require('../repositories/clienteRepository');
const AppError = require('../utils/AppError');

class ClienteService {
    async criar(data) {
        const { nome, cpf, telefone } = data;

        if (!nome || !cpf || !telefone) {
            throw new AppError('Nome, CPF e telefone são obrigatórios');
        }

        const clienteExistente = await clienteRepository.findByCpf(cpf);
        if (clienteExistente) {
            throw new AppError('Já existe um cliente cadastrado com este CPF');
        }

        return clienteRepository.create(data);
    }

    async listar() {
        return clienteRepository.findAll();
    }

    async buscarPorId(id) {
        const cliente = await clienteRepository.findById(id);
        if (!cliente) {
            throw new AppError('Cliente não encontrado', 404);
        }
        return cliente;
    }

    async atualizar(id, data) {
        await this.buscarPorId(id);

        if (data.cpf) {
            const clienteComCpf = await clienteRepository.findByCpf(data.cpf);
            if (clienteComCpf && clienteComCpf._id.toString() !== id) {
                throw new AppError('Já existe um cliente cadastrado com este CPF');
            }
        }

        return clienteRepository.update(id, data);
    }

    async excluir(id) {
        await this.buscarPorId(id);
        return clienteRepository.delete(id);
    }
}

module.exports = new ClienteService();