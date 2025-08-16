import express from "express";
import {
  Login,
  Signup,
  RefreshToken,
  GetMe,
  ResetPassword,
  GoogleCallback,
  UpdateUsernameController,
  CheckUsernameController,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", Signup);
router.post("/login", Login);
router.post("/google/callback", GoogleCallback); 
router.post("/reset-password", ResetPassword);
router.put("/update-username", authMiddleware, UpdateUsernameController);
router.get("/check-username/:username", authMiddleware, CheckUsernameController);
router.post("/refresh-token", RefreshToken);
router.get("/me", authMiddleware, GetMe);


export default router;
