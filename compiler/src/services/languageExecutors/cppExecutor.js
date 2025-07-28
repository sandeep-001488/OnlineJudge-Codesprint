const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const fileService = require("../fileService");
const { OUTPUTS_DIR, EXECUTION_TIMEOUT } = require("../../config/constants");

class CppExecutor {
  constructor() {
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(OUTPUTS_DIR)) {
      fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
    }
  }

  async execute(filePath, inputPath, jobId) {
    const outPath = path.join(OUTPUTS_DIR, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
      const compileCommand = `g++ "${filePath}" -o "${outPath}"`;

      // Step 1: Compile the code
      exec(compileCommand, (compileErr, _, compileStderr) => {
        if (compileErr) {
          const errorStr = compileStderr.toString();
          const lineMatch = errorStr.match(/[^:]+:(\d+):/);
          const line = lineMatch ? parseInt(lineMatch[1]) : null;

          // Cleanup files
          fileService.cleanupFiles([filePath, inputPath]);

          return reject({
            type: "compilation",
            message: errorStr,
            line,
          });
        }

        // Step 2: Execute the binary
        const execCommand =
          process.platform === "win32"
            ? `"${outPath}" < "${inputPath}"`
            : `"${outPath}" < "${inputPath}"`;

        exec(
          execCommand,
          { timeout: EXECUTION_TIMEOUT },
          (runtimeErr, stdout, runtimeStderr) => {
            // Cleanup files
            fileService.cleanupFiles([filePath, inputPath, outPath]);

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
  }
}

module.exports = new CppExecutor();
