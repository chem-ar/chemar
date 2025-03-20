function checkRole(requiredRole) {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== requiredRole) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
}

module.exports = { checkRole };
