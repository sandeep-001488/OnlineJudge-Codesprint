const { exec } = require("child_process");
const { cleanupFiles } = require("../fileService");
const { EXECUTION_TIMEOUT } = require("../../config/constants");

const executePython = async (filePath, inputPath, jobId) => {
  return new Promise((resolve, reject) => {
    const pythonCommands = [
      `python3 "${filePath}" < "${inputPath}"`,
      `python "${filePath}" < "${inputPath}"`,
      `/usr/bin/python3 "${filePath}" < "${inputPath}"`,
      `/usr/local/bin/python "${filePath}" < "${inputPath}"`,
    ];

    const tryCommand = (commandIndex) => {
      if (commandIndex >= pythonCommands.length) {
        cleanupFiles([filePath, inputPath]);
        return reject({
          type: "runtime",
          message:
            "Python interpreter not found. Please ensure Python is installed.",
          line: null,
          jobId,
        });
      }

      const command = pythonCommands[commandIndex];

      exec(command, { timeout: EXECUTION_TIMEOUT }, (err, stdout, stderr) => {
        if (err) {
          if (err.message.includes("not found") || err.code === 127) {
            return tryCommand(commandIndex + 1);
          }

          cleanupFiles([filePath, inputPath]);

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
            jobId,
          });
        }

        cleanupFiles([filePath, inputPath]);
        resolve(stdout);
      });
    };

    tryCommand(0);
  });
};

module.exports = {
  executePython,
};
