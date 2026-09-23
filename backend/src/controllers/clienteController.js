const clienteService = require('../services/clienteService');
const handleError = require('../utils/handleError');

class ClienteController {
    async criar(req, res) {
        try {
            const cliente = await clienteService.criar(req.body);
            return res.status(201).json({
                success: true,
                data: cliente,
                message: 'Cliente cadastrado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async listar(req, res) {
        try {
            const clientes = await clienteService.listar();
            return res.status(200).json({
                success: true,
                data: clientes,
                message: 'Clientes listados com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async buscarPorId(req, res) {
        try {
            const cliente = await clienteService.buscarPorId(req.params.id);
            return res.status(200).json({
                success: true,
                data: cliente,
                message: 'Cliente encontrado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async atualizar(req, res) {
        try {
            const cliente = await clienteService.atualizar(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                data: cliente,
                message: 'Cliente atualizado com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async excluir(req, res) {
        try {
            await clienteService.excluir(req.params.id);
            return res.status(200).json({
                success: true,
                data: {},
                message: 'Cliente excluído com sucesso',
            });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new ClienteController();