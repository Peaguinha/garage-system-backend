const { Router } = require('express');

const PecaController = require('../controllers/PecaController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = Router();

router.use(authMiddleware);

router.post(
    '/',
    roleMiddleware('ADMIN'),
    PecaController.criar
);

router.get(
    '/',
    PecaController.listar
);

router.get(
    '/:id',
    PecaController.buscarPorId
);

router.put(
    '/:id',
    roleMiddleware('ADMIN'),
    PecaController.atualizar
);

router.delete(
    '/:id',
    roleMiddleware('ADMIN'),
    PecaController.remover
);

module.exports = router;