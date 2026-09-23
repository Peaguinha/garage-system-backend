const express = require('express');
const veiculoController = require('../controllers/veiculoController');

const router = express.Router();

router.post('/', veiculoController.criar);
router.get('/', veiculoController.listar);
router.get('/:id', veiculoController.buscarPorId);
router.put('/:id', veiculoController.atualizar);
router.delete('/:id', veiculoController.excluir);
router.get('/:id/ordens-servico', veiculoController.historicoOrdensServico);

module.exports = router;