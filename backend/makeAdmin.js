
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

async function makeAdmin() {
  try {
    const email = String(process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();

    if (!email || !process.env.MONGO_URI) {
      throw new Error("ADMIN_EMAIL or MONGO_URI is missing.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No registered account found for this email.");
    }

    user.role = "admin";
    await user.save();

    console.log("Administrator access enabled.");
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
