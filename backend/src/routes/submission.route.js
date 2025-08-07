import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { createSubmissionController, deleteSubmissionController, getAllSubmissionsController, getSubmissionByIdController, getSubmissionsByProblemController, getUserSubmissionsController } from "../controllers/submission.controllers.js";
import { requireRole } from "../middleware/role.middleware.js";


const router = express.Router();

// Public or user-only routes
router.post("/", authMiddleware, createSubmissionController);
router.get("/my", authMiddleware, getUserSubmissionsController);
router.get(
  "/problem/:problemId",
  authMiddleware,
  getSubmissionsByProblemController
);
router.get("/:id", authMiddleware, getSubmissionByIdController);

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  getAllSubmissionsController
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteSubmissionController
);

export default router;
