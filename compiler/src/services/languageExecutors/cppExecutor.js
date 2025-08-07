const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { cleanupFiles } = require("../fileService");
const { OUTPUTS_DIR, EXECUTION_TIMEOUT } = require("../../config/constants");

const ensureOutputDir = () => {
  if (!fs.existsSync(OUTPUTS_DIR)) {
    fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
  }
};

const executeCpp = async (filePath, inputPath, jobId) => {
  ensureOutputDir();
  const outPath = path.join(OUTPUTS_DIR, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const compileCommand = `g++ "${filePath}" -o "${outPath}"`;

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr) {
        const errorStr = compileStderr.toString();
        const lineMatch = errorStr.match(/[^:]+:(\d+):/);
        const line = lineMatch ? parseInt(lineMatch[1]) : null;

        cleanupFiles([filePath, inputPath]);

        return reject({
          type: "compilation",
          message: errorStr,
          line,
        });
      }

      const execCommand =
        process.platform === "win32"
          ? `"${outPath}" < "${inputPath}"`
          : `"${outPath}" < "${inputPath}"`;

      exec(
        execCommand,
        { timeout: EXECUTION_TIMEOUT },
        (runtimeErr, stdout, runtimeStderr) => {
          cleanupFiles([filePath, inputPath, outPath]);

          if (runtimeErr) {
            if (runtimeErr.killed) {
              return reject({
                type: "runtime",
                message: `Program execution timed out (${
                  EXECUTION_TIMEOUT / 1000
                } seconds limit)`,
                line: null,
              });
            }

            const errorStr = runtimeStderr.toString() || runtimeErr.message;
            return reject({
              type: "runtime",
              message: errorStr,
              line: null,
            });
          }

          resolve(stdout);
        }
      );
    });
  });
};

module.exports = {
  executeCpp,
};
