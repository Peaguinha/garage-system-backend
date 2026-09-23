const mongoose = require('mongoose');

const veiculoSchema = new mongoose.Schema(
    {
        placa: {
            type: String,
            required: [true, 'Placa é obrigatória'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        modelo: {
            type: String,
            required: [true, 'Modelo é obrigatório'],
            trim: true,
        },
        marca: {
            type: String,
            required: [true, 'Marca é obrigatória'],
            trim: true,
        },
        ano: {
            type: Number,
            required: [true, 'Ano é obrigatório'],
        },
        cor: {
            type: String,
            trim: true,
        },
        clienteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cliente',
            required: [true, 'Veículo deve estar associado a um cliente'],
        },
    },
    {
        timestamps: true,
        collection: 'veiculos',
    }
);

module.exports = mongoose.model('Veiculo', veiculoSchema);