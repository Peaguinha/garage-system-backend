const AppError = require('./AppError');

function handleError(res, error) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    console.error(error);
    return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
    });
}

module.exports = handleError;