const { exec } = require("child_process");
const fileService = require("../fileService");
const { EXECUTION_TIMEOUT } = require("../../config/constants");

class JavaScriptExecutor {
  async execute(filePath, inputPath, jobId) {
    console.log(`[${jobId}] Starting JavaScript execution`);

    return new Promise((resolve, reject) => {
      const command = `node "${filePath}" < "${inputPath}"`;

      exec(command, { timeout: EXECUTION_TIMEOUT }, (err, stdout, stderr) => {
        // Cleanup files
        fileService.cleanupFiles([filePath, inputPath]);

        if (err) {
          console.error(`[${jobId}] JavaScript execution failed:`, err.message);

          if (err.killed) {
            return reject({
              type: "runtime",
              message: `Program execution timed out (${
                EXECUTION_TIMEOUT / 1000
              } seconds limit)`,
              line: null,
              jobId,
            });
          }

          const errorStr = stderr.toString() || err.message;
          const lineMatch = errorStr.match(/:(\d+):\d+/);
          const line = lineMatch ? parseInt(lineMatch[1]) : null;

          const isSyntaxError = errorStr.includes("SyntaxError");

          return reject({
            type: isSyntaxError ? "compilation" : "runtime",
            message: errorStr,
            line,
            jobId,
          });
        }

        console.log(`[${jobId}] JavaScript execution completed successfully`);
        resolve(stdout);
      });
    });
  }
}

module.exports = new JavaScriptExecutor();
