const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: [true, 'Nome é obrigatório'],
            trim: true,
        },
        cpf: {
            type: String,
            required: [true, 'CPF é obrigatório'],
            unique: true,
            trim: true,
        },
        telefone: {
            type: String,
            required: [true, 'Telefone é obrigatório'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        endereco: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        collection: 'clientes',
    }
);

module.exports = mongoose.model('Cliente', clienteSchema);

