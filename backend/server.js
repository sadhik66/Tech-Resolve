
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Routes
const authRoutes = require("./routes/authRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adminLessonRoutes = require("./routes/adminLessonRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "20kb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Tech Resolve API is running"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin/lessons", adminLessonRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Unexpected server error"
  });
});

const PORT = process.env.PORT || 5000;

// Start server
async function start() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI. Create backend/.env using .env.example.");
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in backend/.env.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    app.listen(PORT, () => {
      console.log(`Tech Resolve API running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

start();
