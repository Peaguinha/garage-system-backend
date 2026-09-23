const authService = require('../services/authService');

class AuthController {
    async criarUsuario(req, res) {
        try {
            const usuario = await authService.criarUsuario(req.body);

            return res.status(201).json({
                success: true,
                data: {
                    id: usuario._id,
                    nome: usuario.nome,
                    email: usuario.email,
                    role: usuario.role,
                },
                message: 'Usuário criado com sucesso',
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            const resultado = await authService.login(email, senha);

            return res.status(200).json({
                success: true,
                data: resultado,
                message: 'Login realizado com sucesso',
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = new AuthController();