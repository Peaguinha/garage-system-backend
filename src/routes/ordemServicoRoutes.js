const express = require('express');
const ordemServicoController = require('../controllers/ordemServicoController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas de ordens de serviço exigem usuário autenticado.
router.use(authMiddleware);

router.post('/', ordemServicoController.criar);
router.get('/', ordemServicoController.listar);
router.get('/:id', ordemServicoController.buscarPorId);
router.put('/:id', ordemServicoController.atualizar);
router.delete('/:id', ordemServicoController.excluir);

router.patch('/:id/servicos', ordemServicoController.adicionarServico);
router.patch('/:id/pecas', ordemServicoController.adicionarPeca);
router.patch('/:id/status', ordemServicoController.atualizarStatus);

module.exports = router;
