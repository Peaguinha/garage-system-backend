const {verifyToken} = require('../utils/jwt.js');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ 
            message: 'Token não fornecido' 
        });
    }

const token = authHeader.split(' ')[1]; 

try {
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
} catch (error) {
    return res.status(401).json({ 
        message: 'Token inválido' 
    });
 }
};

module.exports = authMiddleware;