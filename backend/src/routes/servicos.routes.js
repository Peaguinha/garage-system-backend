const { Router } = require('express');

const ServicoController = require('../controllers/ServicoController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

// Todas as rotas de serviços exigem autenticação.
router.use(authMiddleware);

// Apenas ADMIN e ATENDENTE podem cadastrar serviços.
router.post(
    '/',
    roleMiddleware('ADMIN'),
    ServicoController.criar
);

// Usuários autenticados podem consultar serviços.
router.get(
    '/',
    ServicoController.listar
);

router.get(
    '/:id',
    ServicoController.buscarPorId
);

// Apenas ADMIN pode alterar/remover serviços.
router.put(
    '/:id',
    roleMiddleware('ADMIN'),
    ServicoController.atualizar
);

router.delete(
    '/:id',
    roleMiddleware('ADMIN'),
    ServicoController.remover
);

module.exports = router;