const { exec } = require("child_process");
const { cleanupFiles } = require("../fileService");
const { EXECUTION_TIMEOUT } = require("../../config/constants");

const executeJavascript = async (filePath, inputPath, jobId) => {

  return new Promise((resolve, reject) => {
    const command = `node "${filePath}" < "${inputPath}"`;

    const childProcess = exec(
      command,
      { timeout: EXECUTION_TIMEOUT },
      (err, stdout, stderr) => {
        cleanupFiles([filePath, inputPath]);

        if (err) {
          console.error(`[${jobId}] JavaScript execution failed:`, err.message);

          if (err.code === "ECONNRESET" || err.message.includes("ECONNRESET")) {
            return reject({
              type: "runtime",
              message:
                "Connection was reset during execution. Please try again.",
              line: null,
              jobId,
            });
          }

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

        resolve(stdout);
      }
    );

    process.on("SIGTERM", () => {
      if (childProcess) {
        childProcess.kill();
      }
    });
  });
};

module.exports = {
  executeJavascript,
};
