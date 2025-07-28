const { exec } = require("child_process");
const fileService = require("../fileService");
const { EXECUTION_TIMEOUT } = require("../../config/constants");

class PythonExecutor {
  async execute(filePath, inputPath, jobId) {
    console.log(`[${jobId}] Starting Python execution`);
    return new Promise((resolve, reject) => {
      const command = `python "${filePath}" < "${inputPath}"`;

      exec(command, { timeout: EXECUTION_TIMEOUT }, (err, stdout, stderr) => {
        // Cleanup files
        fileService.cleanupFiles([filePath, inputPath]);

        if (err) {
             console.error(`[${jobId}] Python execution failed:`, err.message);
          if (err.killed) {
            return reject({
              type: "runtime",
              message: `Program execution timed out (${
                EXECUTION_TIMEOUT / 1000
              } seconds limit)`,
              line: null,
              jobId
            });
          }

          const errorStr = stderr.toString();
          const lineMatch = errorStr.match(/line (\d+)/i);
          const line = lineMatch ? parseInt(lineMatch[1]) : null;

          const isSyntaxError =
            errorStr.includes("SyntaxError") ||
            errorStr.includes("IndentationError") ||
            errorStr.includes("TabError");

          return reject({
            type: isSyntaxError ? "compilation" : "runtime",
            message: errorStr,
            line,
            jobId
          });
        }

        resolve(stdout);
      });
    });
  }
}

module.exports = new PythonExecutor();
