const { executeCode: runCode } = require("../services/executionService");

const executeCode = async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const result = await runCode(language, code, input);

    return res.json({
      success: true,
      output: result.output || "Program executed successfully with no output",
      executionTime: `${result.executionTime.toFixed(2)} ms`,
      memory: `${result.memoryUsed} KB`,
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
