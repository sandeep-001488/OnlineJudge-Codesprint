import express from "express";
import {
  createTestCaseController,
  getTestCasesByProblemIdController,
  updateTestCaseController,
  deleteTestCaseController,
  getAllTestCasesController,
} from "../controllers/testcase.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/problem/:problemId",authMiddleware, getTestCasesByProblemIdController);

router.get(
  "/",
  authMiddleware,
  requireRole("admin"),
  getAllTestCasesController
);

router.post(
  "/create",
  authMiddleware,
  requireRole("admin", "problemSetter"),
  createTestCaseController
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "problemSetter"),
  updateTestCaseController
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "problemSetter"),
  deleteTestCaseController
);

export default router;
