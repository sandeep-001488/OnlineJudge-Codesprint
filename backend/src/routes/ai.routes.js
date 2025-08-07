import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { aiRateLimiter } from "../middleware/ai.rate-limiter.middleware.js";
import {
  explainCompilationError,
  explainHiddenTestCaseFailure,
  explainVisibleTestCase,
  generateHintForProblem,
  suggestOptimizations,
} from "../controllers/ai.controllers.js";

const router = express.Router();

router.use(aiRateLimiter);

router.post("/explain-error", authMiddleware, explainCompilationError);
router.post("/generate-hint", authMiddleware, generateHintForProblem);
router.post(
  "/explain-hidden-testcase-failure",
  authMiddleware,
  explainHiddenTestCaseFailure
);
router.post(
  "/explain-visible-testcase",
  authMiddleware,
  explainVisibleTestCase
);
router.post("/suggest-optimizations", authMiddleware, suggestOptimizations);

export default router;
