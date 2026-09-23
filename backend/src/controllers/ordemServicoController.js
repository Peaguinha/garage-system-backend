const ordemServicoService = require('../services/ordemServicoService');
const handleError = require('../utils/handleError');

class OrdemServicoController {
    async criar(req, res) {
        try {
            const ordem = await ordemServicoService.criar(req.body);
            return res.status(201).json({
                success: true,
                data: ordem,
                message: 'Ordem de serviço aberta com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async listar(req, res) {
        try {
            const ordens = await ordemServicoService.listar();
            return res.status(200).json({
                success: true,
                data: ordens,
                message: 'Ordens de serviço listadas com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async buscarPorId(req, res) {
        try {
            const ordem = await ordemServicoService.buscarPorId(req.params.id);
            return res.status(200).json({
                success: true,
                data: ordem,
                message: 'Ordem de serviço encontrada com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async atualizar(req, res) {
        try {
            const ordem = await ordemServicoService.atualizar(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                data: ordem,
                message: 'Ordem de serviço atualizada com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async excluir(req, res) {
        try {
            await ordemServicoService.excluir(req.params.id);
            return res.status(200).json({
                success: true,
                data: {},
                message: 'Ordem de serviço excluída com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async adicionarServico(req, res) {
        try {
            const ordem = await ordemServicoService.adicionarServico(
                req.params.id,
                req.body.servicoId
            );
            return res.status(200).json({
                success: true,
                data: ordem,
                message: 'Serviço adicionado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async adicionarPeca(req, res) {
        try {
            const ordem = await ordemServicoService.adicionarPeca(
                req.params.id,
                req.body.pecaId,
                req.body.quantidade
            );
            return res.status(200).json({
                success: true,
                data: ordem,
                message: 'Peça adicionada com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async atualizarStatus(req, res) {
        try {
            const ordem = await ordemServicoService.atualizarStatus(
                req.params.id,
                req.body.status
            );
            return res.status(200).json({
                success: true,
                data: ordem,
                message: 'Status da ordem de serviço atualizado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new OrdemServicoController();
