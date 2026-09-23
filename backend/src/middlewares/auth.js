const { verifyToken } = require("../utils/jwt");

function getUserFromToken(authorizationHeader) {
    if (!authorizationHeader) {
        return null;
    }

    const parts = authorizationHeader.trim().split(/\s+/);

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        return null;
    }

    const token = parts[1];

    try {
        return verifyToken(token);
    } catch (error) {
        return null;
    }
}

function assertAutenticado(user) {
    if (!user) {
        const error = new Error(
            "Não autenticado. Informe um token JWT válido."
        );

        error.extensions = {
            code: "UNAUTHENTICATED",
        };

        throw error;
    }
}

function assertAutorizado(user, rolesPermitidos = []) {
    assertAutenticado(user);

    if (
        rolesPermitidos.length &&
        !rolesPermitidos.includes(user.role)
    ) {
        const error = new Error(
            "Usuário não autorizado para esta operação."
        );

        error.extensions = {
            code: "FORBIDDEN",
        };

        throw error;
    }
}

module.exports = {
    getUserFromToken,
    assertAutenticado,
    assertAutorizado,
};