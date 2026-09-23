const mongoose = require('mongoose');
const Veiculo = require('../models/Veiculo');

class VeiculoRepository {
    async create(data) {
        return Veiculo.create(data);
    }

    async findAll() {
        return Veiculo.find().sort({ createdAt: -1 }).populate('clienteId', 'nome cpf telefone');
    }

    async findById(id) {
        return Veiculo.findById(id).populate('clienteId', 'nome cpf telefone');
    }

    async findByPlaca(placa) {
        return Veiculo.findOne({ placa: placa.toUpperCase() });
    }

    async update(id, data) {
        return Veiculo.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate('clienteId', 'nome cpf telefone');
    }

    async delete(id) {
        return Veiculo.findByIdAndDelete(id);
    }

    /**
     * Consulta o histórico de ordens de serviço de um veículo.
     * A coleção `ordens_servico` é de responsabilidade do módulo de
     * Ordens de Serviço (Kaik); aqui acessamos diretamente a coleção,
     * sem depender do model, para não colidir com esse módulo.
     */
    async findHistoricoOrdensServico(veiculoId) {
        const db = mongoose.connection.db;
        return db
            .collection('ordens_servico')
            .find({ veiculoId: new mongoose.Types.ObjectId(veiculoId) })
            .sort({ createdAt: -1 })
            .toArray();
    }
}

module.exports = new VeiculoRepository();