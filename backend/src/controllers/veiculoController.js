const veiculoService = require('../services/veiculoService');
const handleError = require('../utils/handleError');

class VeiculoController {
    async criar(req, res) {
        try {
            const veiculo = await veiculoService.criar(req.body);
            return res.status(201).json({
                success: true,
                data: veiculo,
                message: 'Veículo cadastrado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async listar(req, res) {
        try {
            const veiculos = await veiculoService.listar();
            return res.status(200).json({
                success: true,
                data: veiculos,
                message: 'Veículos listados com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async buscarPorId(req, res) {
        try {
            const veiculo = await veiculoService.buscarPorId(req.params.id);
            return res.status(200).json({
                success: true,
                data: veiculo,
                message: 'Veículo encontrado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async atualizar(req, res) {
        try {
            const veiculo = await veiculoService.atualizar(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                data: veiculo,
                message: 'Veículo atualizado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async excluir(req, res) {
        try {
            await veiculoService.excluir(req.params.id);
            return res.status(200).json({
                success: true,
                data: {},
                message: 'Veículo excluído com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async historicoOrdensServico(req, res) {
        try {
            const historico = await veiculoService.historicoOrdensServico(req.params.id);
            return res.status(200).json({
                success: true,
                data: historico,
                message: 'Histórico de ordens de serviço listado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new VeiculoController();