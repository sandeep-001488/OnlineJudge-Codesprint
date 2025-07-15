import dotenv from "dotenv";
import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import { connectDB } from "./src/config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
