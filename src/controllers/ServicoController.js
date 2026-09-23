const ServicoService = require('../services/ServicoService');

class ServicoController {
  async criar(req, res, next) {
    try {
      const servico = await ServicoService.criar(req.body);
      return res.status(201).json({
        success: true,
        data: servico,
        message: 'Serviço cadastrado com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const servicos = await ServicoService.listar();
      return res.status(200).json({
        success: true,
        data: servicos,
        message: 'Serviços listados com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const servico = await ServicoService.buscarPorId(req.params.id);
      return res.status(200).json({
        success: true,
        data: servico,
        message: 'Serviço encontrado com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const servico = await ServicoService.atualizar(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: servico,
        message: 'Serviço atualizado com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async remover(req, res, next) {
    try {
      await ServicoService.remover(req.params.id);
      return res.status(200).json({
        success: true,
        data: {},
        message: 'Serviço removido com sucesso.',
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ServicoController();
