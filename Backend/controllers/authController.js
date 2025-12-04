const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// user register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.json({ message: "User Already Exists" });

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPass });
    await newUser.save();

    res.json({ message: "User Registered" });
  } catch (error) {
    console.log("Error", error);
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

    req.session.user = { id: user.id, name: user.name ,role: "user" };
    req.session.cart = [];
    res.json({ message: "User Logged In",
      role : "user",
      name : user.name
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
      res.clearCookie("connect.sid", { path: "/", httpOnly: true, sameSite: "lax" });
      res.json({ message: "Logged Out Successfully" });
    });
  } else {
    res.json({ message: "No active session" });
  }
};


exports.checkAuth = (req, res) => {
  if (req.session.user) {
    const { name, role } = req.session.user;
    return res.json({ authenticated: true, name, role });
  } else if (req.session.admin) {
    const { name, role, email } = req.session.admin;
    return res.json({
      authenticated: true,
      name: req.session.admin.name || email, // fallback to email if no name
      role: "admin",
    });
  } else {
    return res.json({ authenticated: false });
  }
};
