const mongoose = require('mongoose');

const STATUS_ORDEM = [
    'ABERTA',
    'EM_DIAGNOSTICO',
    'AGUARDANDO_APROVACAO',
    'EM_EXECUCAO',
    'CONCLUIDA',
    'CANCELADA',
];

// Serviço "congelado" no momento em que foi adicionado à ordem,
// para que alterações futuras no cadastro de Serviços não mudem
// o valor já cobrado em ordens antigas.
const servicoOrdemSchema = new mongoose.Schema(
    {
        servicoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Servico',
            required: true,
        },
        nome: { type: String, required: true },
        valor: { type: Number, required: true, min: 0.01 },
    },
    { _id: false }
);

// Peça "congelada" no momento em que foi adicionada à ordem, com a
// quantidade utilizada e o preço unitário vigente naquele momento.
const pecaOrdemSchema = new mongoose.Schema(
    {
        pecaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Peca',
            required: true,
        },
        nome: { type: String, required: true },
        quantidade: { type: Number, required: true, min: 1 },
        precoUnitario: { type: Number, required: true, min: 0.01 },
    },
    { _id: false }
);

const ordemServicoSchema = new mongoose.Schema(
    {
        veiculoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Veiculo',
            required: [true, 'Ordem de serviço deve estar associada a um veículo'],
        },
        mecanicoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Ordem de serviço deve estar associada a um mecânico'],
        },
        descricaoProblema: {
            type: String,
            required: [true, 'Descrição do problema é obrigatória'],
            trim: true,
        },
        diagnostico: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: STATUS_ORDEM,
            default: 'ABERTA',
        },
        servicos: {
            type: [servicoOrdemSchema],
            default: [],
        },
        pecas: {
            type: [pecaOrdemSchema],
            default: [],
        },
        valorTotal: {
            type: Number,
            default: 0,
        },
        dataAbertura: {
            type: Date,
            default: Date.now,
        },
        dataConclusao: {
            type: Date,
        },
    },
    {
        timestamps: true,
        collection: 'ordens_servico',
    }
);

ordemServicoSchema.statics.STATUS_ORDEM = STATUS_ORDEM;

module.exports = mongoose.model('OrdemServico', ordemServicoSchema);
