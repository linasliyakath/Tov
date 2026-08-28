require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const connectDB = require("../config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@gmail.com";
    const rawPassword = "123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    let admin = await User.findOne({ email });

    if (admin) {
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isActive = true;
      await admin.save();
      console.log("Existing admin user updated successfully.");
    } else {
      admin = new User({
        name: "Admin",
        email: email,
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });
      await admin.save();
      console.log("New admin user created successfully.");
    }

    console.log(`Admin credentials set: Email: ${email} | Password: ${rawPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin account:", error);
    process.exit(1);
  }
};

seedAdmin();
