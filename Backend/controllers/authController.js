const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { createAuthToken, getRequestAuth } = require("../utils/authToken");

// user register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: "An account already exists for this email" });

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPass });
    await newUser.save();

    return res.status(201).json({ message: "User Registered" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Could not register your account" });
  }
};

// user login

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Your account is disabled. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Invalid credentials" });

    const userId = user._id.toString();
    const token = createAuthToken({ id: userId, name: user.name, role: "user" });
    const payload = {
      message: "User Logged In",
      role: "user",
      name: user.name,
      id: userId,
      token,
    };

    req.session.user = { id: userId, name: user.name, role: "user" };
    req.session.cart = [];
    return req.session.save((sessionError) => {
      if (sessionError) {
        console.error("Session save error:", sessionError);
      }
      return res.json(payload);
    });
  } catch (error) {
    console.error("User Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// user logout
exports.logout = (req, res) => {
  if (req.session.user || req.session.admin) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("tov.sid", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      res.json({ message: "Logged Out Successfully" });
    });
  } else {
    res.json({ message: "No active session" });
  }
};


exports.checkAuth = (req, res) => {
  const user = getRequestAuth(req);
  if (user?.role === "user") {
    const { id, name, role } = user;
    return res.json({ authenticated: true, id, name, role });
  } else if (user?.role === "admin") {
    const { id, name, role, email } = user;
    return res.json({
      authenticated: true,
      id,
      name: name || email,
      role: "admin",
    });
  } else {
    return res.json({ authenticated: false });
  }
};
