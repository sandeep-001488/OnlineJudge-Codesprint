import express from "express";
import { Login, Signup } from "../controllers/auth.controllers.js";
const router = express.Router();

router.post("/register", Signup);
router.post("/login", Login);

export default router;
