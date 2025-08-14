const express = require("express");
const cors = require("cors");
const codeRoutes = require("./src/routes/codeRoutes");
const { errorHandler } = require("./src/utils/errorHandler");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", codeRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Online Judge compiler  API");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(errorHandler);

module.exports = app;
