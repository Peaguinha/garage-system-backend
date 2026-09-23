const mongoose = require('mongoose');
const veiculoRepository = require('../repositories/veiculoRepository');
const clienteRepository = require('../repositories/clienteRepository');
const AppError = require('../utils/AppError');

class VeiculoService {
    async criar(data) {
        const { placa, modelo, marca, ano, clienteId } = data;

        if (!placa || !modelo || !marca || !ano || !clienteId) {
            throw new AppError('Placa, modelo, marca, ano e clienteId são obrigatórios');
        }

        if (!mongoose.Types.ObjectId.isValid(clienteId)) {
            throw new AppError('clienteId inválido');
        }

        const cliente = await clienteRepository.findById(clienteId);
        if (!cliente) {
            throw new AppError('Não é possível associar veículo a um cliente inexistente', 404);
        }

        const veiculoExistente = await veiculoRepository.findByPlaca(placa);
        if (veiculoExistente) {
            throw new AppError('Já existe um veículo cadastrado com esta placa');
        }

        return veiculoRepository.create(data);
    }

    async listar() {
        return veiculoRepository.findAll();
    }

    async buscarPorId(id) {
        const veiculo = await veiculoRepository.findById(id);
        if (!veiculo) {
            throw new AppError('Veículo não encontrado', 404);
        }
        return veiculo;
    }

    async atualizar(id, data) {
        await this.buscarPorId(id);

        if (data.clienteId) {
            if (!mongoose.Types.ObjectId.isValid(data.clienteId)) {
                throw new AppError('clienteId inválido');
            }
            const cliente = await clienteRepository.findById(data.clienteId);
            if (!cliente) {
                throw new AppError('Não é possível associar veículo a um cliente inexistente', 404);
            }
        }

        if (data.placa) {
            const veiculoComPlaca = await veiculoRepository.findByPlaca(data.placa);
            if (veiculoComPlaca && veiculoComPlaca._id.toString() !== id) {
                throw new AppError('Já existe um veículo cadastrado com esta placa');
            }
        }

        return veiculoRepository.update(id, data);
    }

    async excluir(id) {
        await this.buscarPorId(id);
        return veiculoRepository.delete(id);
    }

    async historicoOrdensServico(id) {
        await this.buscarPorId(id);
        return veiculoRepository.findHistoricoOrdensServico(id);
    }
}

module.exports = new VeiculoService();