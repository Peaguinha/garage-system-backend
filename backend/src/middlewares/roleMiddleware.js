const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        
        if(req.user.role !== requiredRole) {
            return res.status(403).json({ 
                message: 'Acesso Negado.' });
        }
        next();
    }
}

module.exports = roleMiddleware;