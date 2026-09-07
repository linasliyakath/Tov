require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin is not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database unavailable:", error);
    res.status(503).json({ message: "Database is temporarily unavailable" });
  }
});

app.use(
  session({
    name: "tov.sid",
    secret: process.env.SESSION_SECRET || "development-only-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server Running on http://localhost:${PORT}`)
  );
}

module.exports = app;
