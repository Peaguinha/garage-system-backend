const PecaService = require('../services/PecaService');

class PecaController {
  async criar(req, res, next) {
    try {
      const peca = await PecaService.criar(req.body);
      return res.status(201).json({
        success: true,
        data: peca,
        message: 'Peça cadastrada com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const pecas = await PecaService.listar();
      return res.status(200).json({
        success: true,
        data: pecas,
        message: 'Peças listadas com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const peca = await PecaService.buscarPorId(req.params.id);
      return res.status(200).json({
        success: true,
        data: peca,
        message: 'Peça encontrada com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const peca = await PecaService.atualizar(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: peca,
        message: 'Peça atualizada com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async remover(req, res, next) {
    try {
      await PecaService.remover(req.params.id);
      return res.status(200).json({
        success: true,
        data: {},
        message: 'Peça removida com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PecaController();
