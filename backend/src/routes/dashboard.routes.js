import express from "express";
import {
  getUserStats,
  getUserProfile,
  getLeaderboard,
} from "../controllers/dashboard.controllers.js";

const router = express.Router();

router.get("/stats/:username", getUserStats);
router.get("/profile/:username", getUserProfile);
router.get("/leaderboard", getLeaderboard);


export default router;
