import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.route.js";
import problemRoutes from "./src/routes/problem.route.js"
import compilerRoutes from "./src/controllers/compiler.controllers.js"
import testcaseRoutes  from "./src/routes/testcase.route.js"
import { connectDB } from "./src/config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,DELETE,PUT",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/testcases",testcaseRoutes)
app.use("/api", compilerRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
