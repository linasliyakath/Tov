const jwt = require("jsonwebtoken");

const getJwtSecret = () => process.env.JWT_SECRET || process.env.SESSION_SECRET;

const getUserIdFromAuth = (user) => {
  const id = user?.id || user?._id || user?.userId;
  return id ? String(id) : null;
};

const createAuthToken = (user) => {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const id = getUserIdFromAuth(user);
  if (!id) {
    throw new Error("Cannot create auth token without a user id");
  }

  return jwt.sign(
    { id, name: user.name, role: user.role, email: user.email },
    secret,
    { expiresIn: "24h" }
  );
};

const getRequestAuth = (req) => {
  const authorization = req.get?.("authorization") || req.headers?.authorization;
  if (authorization?.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(authorization.slice(7), getJwtSecret());
      const id = getUserIdFromAuth(payload);
      if (payload?.role && id) {
        return { ...payload, id };
      }
    } catch {
      // Fall back to the session when the bearer token is missing or invalid.
    }
  }

  if (req.session?.user) {
    const sessionUser = req.session.user;
    const id = getUserIdFromAuth(sessionUser);
    return id ? { ...sessionUser, id } : sessionUser;
  }

  if (req.session?.admin) {
    const sessionAdmin = req.session.admin;
    const id = getUserIdFromAuth(sessionAdmin);
    return id ? { ...sessionAdmin, id } : sessionAdmin;
  }

  return null;
};

module.exports = { createAuthToken, getRequestAuth, getUserIdFromAuth };
