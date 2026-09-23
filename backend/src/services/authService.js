const bcrypt = require('bcryptjs');

const Usuario = require('../models/Usuario');
const { generateToken } = require('../utils/jwt');

class AuthService {
    async criarUsuario(data) {
        const { nome, email, senha, role } = data;

        if (!nome || !email || !senha || !role) {
            throw new Error('nome, email, senha e role são obrigatórios');
        }

        const usuarioExistente = await Usuario.findOne({ email });

        if (usuarioExistente) {
            throw new Error('E-mail já cadastrado');
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        return Usuario.create({
            nome,
            email,
            senhaHash,
            role,
        });
    }

    async login(email, senha) {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            throw new Error('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senhaHash
        );

        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        const token = generateToken({
            id: usuario._id,
            role: usuario.role,
        });

        return {
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role,
            },
        };
    }
}

module.exports = new AuthService();