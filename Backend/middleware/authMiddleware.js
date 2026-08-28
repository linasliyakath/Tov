exports.isAutheticated = (req, res, next) => {
    if (req.session && req.session.user) return next();
    if (req.headers['x-user-id']) return next();
    return res.status(401).json({ message: "Not Authenticated" });
};

exports.isadmin = (req, res, next) => {
    if (req.session && req.session.admin && req.session.admin.role === 'admin') {
        return next();
    }
    if (req.headers['x-admin-role'] === 'admin') {
        return next();
    }
    return res.status(403).json({ message: "Acssess Denied Admins ONLY" });
};