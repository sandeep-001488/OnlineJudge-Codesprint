import express from "express";
import {
  Login,
  Signup,
  RefreshToken,
  GetMe,
  ResetPassword,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", Signup);
router.post("/login", Login);
router.post("/reset-password", ResetPassword);
router.post("/refresh-token", RefreshToken);
router.get("/me", authMiddleware, GetMe);


export default router;
