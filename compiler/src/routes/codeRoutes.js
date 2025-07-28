const express = require("express");
const {
  executeCode,
  getExecutionStatus,
} = require("../controllers/codeExecutionControllers");
const { validateCodeExecution } = require("../middleware/validation");

const router = express.Router();

router.post("/run", validateCodeExecution, executeCode);

router.get("/status/:jobId", getExecutionStatus);

module.exports = router;
