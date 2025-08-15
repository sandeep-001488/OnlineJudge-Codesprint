import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.route.js";
import problemRoutes from "./src/routes/problem.route.js";
import compilerRoutes from "./src/controllers/compiler.controllers.js";
import testcaseRoutes from "./src/routes/testcase.route.js";
import submissionRoutes from "./src/routes/submission.route.js";
import aiRoutes from "./src/routes/ai.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js"
import feedbackRoutes from "./src/routes/feedback.routes.js";
import { connectDB } from "./src/config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,DELETE,PUT",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
connectDB();

app.get("/", (req, res) => {
  res.send("🚀 Welcome to the Online Judge backend API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/testcases", testcaseRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/feedback", feedbackRoutes);
app.use("/api", compilerRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
