import express from "express";
import {
  createProblemController,
  getAllProblemsController,
  getProblemByIdController,
  updateProblemController,
  deleteProblemController,
  searchProblemController,
} from "../controllers/problem.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/search", searchProblemController);
router.get("/", getAllProblemsController);
router.get("/:id", getProblemByIdController);

router.post(
  "/create",
  authMiddleware,
  requireRole("admin", "problemSetter"),
  createProblemController
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "problemSetter"),
  updateProblemController
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "problemSetter"),
  deleteProblemController
);

export default router;
