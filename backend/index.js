import dotenv from "dotenv";
import express from "express";
import authRoutes from "./src/routes/auth.route.js"; 

dotenv.config(); // ✅ Load env first

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
