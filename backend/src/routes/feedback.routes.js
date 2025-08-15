import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createFeedbackController,
  createSuggestionController,
  getAllFeedbacksController,
  getHomePageStatsController,
  getRecentFeedbacksController,
} from "../controllers/feedback.controllers.js";

const router = express.Router();


router.post(
  "/feedback",
  authMiddleware,
  createFeedbackController
);
router.post(
  "/suggestion",
  authMiddleware,
  createSuggestionController
);
router.get("/feedbacks/recent", getRecentFeedbacksController);
router.get("/feedbacks", getAllFeedbacksController);
router.get("/home-stats", getHomePageStatsController);

export default router;
