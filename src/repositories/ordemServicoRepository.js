const mongoose = require('mongoose');
const OrdemServico = require('../models/OrdemServico');

const POPULATE_LISTA = [
    { path: 'veiculoId', select: 'placa modelo marca ano' },
];

const POPULATE_DETALHE = [
    { path: 'veiculoId', select: 'placa modelo marca ano clienteId' },
];

class OrdemServicoRepository {
    async create(data) {
        return OrdemServico.create(data);
    }

    async findAll() {
        return OrdemServico.find().sort({ createdAt: -1 }).populate(POPULATE_LISTA);
    }

    async findById(id) {
        return OrdemServico.findById(id).populate(POPULATE_DETALHE);
    }

    async update(id, data) {
        return OrdemServico.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(POPULATE_DETALHE);
    }

    async delete(id) {
        return OrdemServico.findByIdAndDelete(id);
    }

    /**
     * Verifica a existência de um usuário com o papel de mecânico.
     * O model de Usuário é responsabilidade do módulo de autenticação
     * (Pedro); aqui acessamos a coleção diretamente para não depender
     * dele — mesmo padrão usado em veiculoRepository para consultar
     * `ordens_servico`.
     */
    async mecanicoExiste(mecanicoId) {
        const db = mongoose.connection.db;
        const usuario = await db.collection('usuarios').findOne({
            _id: new mongoose.Types.ObjectId(mecanicoId),
        });
        return !!usuario && (!usuario.role || usuario.role === 'MECANICO');
    }
}

module.exports = new OrdemServicoRepository();
