const mongoose = require('mongoose');

const pecaSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'Nome da peça é obrigatório'],
            trim: true,
        },
        codigo: {
            type: String,
            trim: true,
        },
        fabricante: {
            type: String,
            trim: true,
        },
        preco: {
            type: Number,
            required: [true, 'Preço da peça é obrigatório'],
            min: [0.01, 'Preço da peça deve ser maior que zero'],
        },
        quantidadeDisponivel: {
            type: Number,
            required: [true, 'Quantidade disponível é obrigatória'],
            min: [0, 'Quantidade disponível não pode ser negativa'],
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: 'pecas',
    }
);

module.exports = mongoose.model('Peca', pecaSchema);