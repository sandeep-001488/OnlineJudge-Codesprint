import express from "express";
import { runCodeController } from "../controllers/compiler.controllers";
const router = express.Router();

router.post("/run", runCodeController);

export default router;
