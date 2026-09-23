const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'Nome do serviço é obrigatório'],
            trim: true,
        },
        descricao: {
            type: String,
            trim: true,
        },
        valor: {
            type: Number,
            required: [true, 'Valor do serviço é obrigatório'],
            min: [0.01, 'Valor do serviço deve ser maior que zero'],
        },
        tempoEstimado: {
            type: Number,
        },
    },
    {
        timestamps: true,
        collection: 'servicos',
    }
);

module.exports = mongoose.model('Servico', servicoSchema);