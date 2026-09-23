const mongoose = require('mongoose');
const ordemServicoRepository = require('../repositories/ordemServicoRepository');
const veiculoRepository = require('../repositories/veiculoRepository');
const Servico = require('../models/Servico');
const Peca = require('../models/Peca');
const AppError = require('../utils/AppError');

// Transições de status permitidas. CONCLUIDA e CANCELADA são estados finais.
const TRANSICOES_PERMITIDAS = {
    ABERTA: ['EM_DIAGNOSTICO', 'CANCELADA'],
    EM_DIAGNOSTICO: ['AGUARDANDO_APROVACAO', 'CANCELADA'],
    AGUARDANDO_APROVACAO: ['EM_EXECUCAO', 'CANCELADA'],
    EM_EXECUCAO: ['CONCLUIDA', 'CANCELADA'],
    CONCLUIDA: [],
    CANCELADA: [],
};

function validarObjectId(id, campo) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(`${campo} inválido`);
    }
}

function calcularValorTotal(ordem) {
    const totalServicos = ordem.servicos.reduce((soma, s) => soma + s.valor, 0);
    const totalPecas = ordem.pecas.reduce((soma, p) => soma + p.precoUnitario * p.quantidade, 0);
    return Number((totalServicos + totalPecas).toFixed(2));
}

class OrdemServicoService {
    async criar(data) {
        const { veiculoId, mecanicoId, descricaoProblema } = data;

        if (!veiculoId || !mecanicoId || !descricaoProblema) {
            throw new AppError('veiculoId, mecanicoId e descricaoProblema são obrigatórios');
        }

        validarObjectId(veiculoId, 'veiculoId');
        validarObjectId(mecanicoId, 'mecanicoId');

        const veiculo = await veiculoRepository.findById(veiculoId);
        if (!veiculo) {
            throw new AppError('Não é possível abrir ordem para um veículo inexistente', 404);
        }

        const mecanicoValido = await ordemServicoRepository.mecanicoExiste(mecanicoId);
        if (!mecanicoValido) {
            throw new AppError('Não é possível associar a ordem a um mecânico inexistente', 404);
        }

        return ordemServicoRepository.create({
            veiculoId,
            mecanicoId,
            descricaoProblema,
            diagnostico: data.diagnostico,
        });
    }

    async listar() {
        return ordemServicoRepository.findAll();
    }

    async buscarPorId(id) {
        validarObjectId(id, 'id');
        const ordem = await ordemServicoRepository.findById(id);
        if (!ordem) {
            throw new AppError('Ordem de serviço não encontrada', 404);
        }
        return ordem;
    }

    async atualizar(id, data) {
        await this.buscarPorId(id);

        // Campos de negócio (status, serviços, peças, valorTotal) têm
        // endpoints próprios com suas regras — aqui só dados descritivos.
        const { descricaoProblema, diagnostico } = data;
        const atualizacao = {};
        if (descricaoProblema !== undefined) atualizacao.descricaoProblema = descricaoProblema;
        if (diagnostico !== undefined) atualizacao.diagnostico = diagnostico;

        return ordemServicoRepository.update(id, atualizacao);
    }

    async excluir(id) {
        await this.buscarPorId(id);
        return ordemServicoRepository.delete(id);
    }

    async adicionarServico(id, servicoId) {
        const ordem = await this.buscarPorId(id);

        if (['CONCLUIDA', 'CANCELADA'].includes(ordem.status)) {
            throw new AppError('Não é possível adicionar serviços a uma ordem finalizada');
        }

        validarObjectId(servicoId, 'servicoId');
        const servico = await Servico.findById(servicoId);
        if (!servico) {
            throw new AppError('Serviço não encontrado', 404);
        }
        if (servico.valor <= 0) {
            throw new AppError('Serviço com valor inválido');
        }

        ordem.servicos.push({
            servicoId: servico._id,
            nome: servico.nome,
            valor: servico.valor,
        });
        ordem.valorTotal = calcularValorTotal(ordem);

        return ordemServicoRepository.update(id, {
            servicos: ordem.servicos,
            valorTotal: ordem.valorTotal,
        });
    }

    async adicionarPeca(id, pecaId, quantidade) {
        const ordem = await this.buscarPorId(id);

        if (['CONCLUIDA', 'CANCELADA'].includes(ordem.status)) {
            throw new AppError('Não é possível adicionar peças a uma ordem finalizada');
        }

        validarObjectId(pecaId, 'pecaId');
        const qtd = Number(quantidade);
        if (!qtd || qtd <= 0) {
            throw new AppError('Quantidade deve ser maior que zero');
        }

        const peca = await Peca.findById(pecaId);
        if (!peca) {
            throw new AppError('Peça não encontrada', 404);
        }
        if (peca.preco <= 0) {
            throw new AppError('Peça com preço inválido');
        }
        if (peca.quantidadeDisponivel < qtd) {
            throw new AppError('Quantidade disponível insuficiente para esta peça');
        }

        ordem.pecas.push({
            pecaId: peca._id,
            nome: peca.nome,
            quantidade: qtd,
            precoUnitario: peca.preco,
        });
        ordem.valorTotal = calcularValorTotal(ordem);

        peca.quantidadeDisponivel -= qtd;
        await peca.save();

        return ordemServicoRepository.update(id, {
            pecas: ordem.pecas,
            valorTotal: ordem.valorTotal,
        });
    }

    async atualizarStatus(id, novoStatus) {
        const ordem = await this.buscarPorId(id);

        const statusValidos = Object.keys(TRANSICOES_PERMITIDAS);
        if (!statusValidos.includes(novoStatus)) {
            throw new AppError('Status inválido');
        }

        const permitido = TRANSICOES_PERMITIDAS[ordem.status].includes(novoStatus);
        if (!permitido) {
            throw new AppError(
                `Transição de status inválida: ${ordem.status} -> ${novoStatus}`
            );
        }

        const atualizacao = { status: novoStatus };
        if (novoStatus === 'CONCLUIDA') {
            atualizacao.dataConclusao = new Date();
        }

        return ordemServicoRepository.update(id, atualizacao);
    }
}

module.exports = new OrdemServicoService();
