const { getRequestAuth } = require("../utils/authToken");

exports.isAutheticated = (req, res, next) => {
    const user = getRequestAuth(req);
    if (user?.role === "user" && user.id) {
        req.auth = user;
        return next();
    }
    return res.status(401).json({ message: "Not Authenticated" });
};

exports.isadmin = (req, res, next) => {
    const user = getRequestAuth(req);
    if (user?.role === "admin") {
        req.auth = user;
        return next();
    }
    return res.status(403).json({ message: "Acssess Denied Admins ONLY" });
};
