import express from "express";
import {
  Login,
  Signup,
  RefreshToken,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", Signup);
router.post("/login", Login);
router.post("/refresh-token", RefreshToken); 

export default router;
