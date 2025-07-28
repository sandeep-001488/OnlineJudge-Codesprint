const express = require("express");
const cors = require("cors");
const codeRoutes = require("./src/routes/codeRoutes");
const { errorHandler } = require("./src/utils/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api", codeRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
