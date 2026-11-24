
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

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://tech-resolve-frontend.onrender.com"
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

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
  console.error("Server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.message === "Not allowed by CORS" ? 403 : 500;

  return res.status(status).json({
    success: false,
    message: status === 403
      ? "Origin not allowed."
      : "Unexpected server error"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Tech Resolve API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

start();
