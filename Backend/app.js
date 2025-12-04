const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

PORT = 3000;

const app = express();
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/uploads", express.static("uploads"));

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

app.get("/check-session", (req, res) => {
  if (req.session.admin)
    return res.json({ loggedInAs: "admin", admin: req.session.admin });
  if (req.session.user)
    return res.json({ loggedInAs: "user", user: req.session.user });
  res.json({ loggedInAs: "none" });
});

app.listen(PORT, () =>
  console.log(`Server Running on http://localhost:${PORT}`)
);