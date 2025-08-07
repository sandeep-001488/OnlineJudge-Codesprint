const { executeCode: runCode } = require("../services/executionService");

const executeCode = async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const startTime = Date.now();
    const result = await runCode(language, code, input);
    const executionTime = Date.now() - startTime;

    return res.json({
      success: true,
      output: result || "Program executed successfully with no output",
      executionTime: `${executionTime}ms`,
      memory: "N/A",
      language,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      type: error.type || "unknown",
      error: error.message || "An unknown error occurred",
      line: error.line || null,
      language,
    });
  }
};

const getExecutionStatus = async (req, res) => {
  const { jobId } = req.params;

  return res.json({
    success: true,
    message: "Status tracking not implemented yet",
    jobId,
  });
};

module.exports = {
  executeCode,
  getExecutionStatus,
};
