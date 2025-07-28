const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const fileService = require("../fileService");
const { EXECUTION_TIMEOUT } = require("../../config/constants");

class JavaExecutor {
  async execute(filePath, inputPath, jobId) {
    console.log(`[${jobId}] Starting Java compilation and execution`);

    return new Promise((resolve, reject) => {
      const rawClassName = path.basename(filePath, ".java");

      // Java class names can only contain letters, digits, underscores, and dollar signs
      // They cannot start with a digit
      // Replace all non-alphanumeric characters with underscores
      let expectedClassName = rawClassName.replace(/[^a-zA-Z0-9_$]/g, "_");

      // If it starts with a number, prefix with underscore
      if (/^\d/.test(expectedClassName)) {
        expectedClassName = "_" + expectedClassName;
      }

      const classDir = path.dirname(filePath);
      const classPath = path.join(classDir, `${expectedClassName}.class`);

      try {
        // Read the original Java code
        let javaCode = fs.readFileSync(filePath, "utf8");

        // Extract the actual class name from the code
        const classNameMatch = javaCode.match(/public\s+class\s+(\w+)/);
        const actualClassName = classNameMatch ? classNameMatch[1] : null;


        // If class names don't match, replace the class name in the code
        if (actualClassName && actualClassName !== expectedClassName) {

          // Replace the class name with the expected one
          javaCode = javaCode.replace(
            new RegExp(`public\\s+class\\s+${actualClassName}\\b`, "g"),
            `public class ${expectedClassName}`
          );

          // Write the modified code back to file
          fs.writeFileSync(filePath, javaCode);
          const newFilePath = path.join(classDir, `${expectedClassName}.java`);
          fs.renameSync(filePath, newFilePath);
          filePath = newFilePath; // update reference
        }
      } catch (readError) {
        console.error(`[${jobId}] Error reading Java file:`, readError.message);
        fileService.cleanupFiles([filePath, inputPath]);
        return reject({
          type: "compilation",
          message: `Error reading Java file: ${readError.message}`,
          line: null,
          jobId,
        });
      }


      const possibleJavaPaths = [
        "javac", // Try default first
        '"C:\\Program Files\\Java\\jdk-24\\bin\\javac.exe"',
        '"C:\\Program Files\\Java\\jdk-17\\bin\\javac.exe"',
        '"C:\\Program Files\\Java\\jdk-21\\bin\\javac.exe"',
      ];

      const compileCommand = `${possibleJavaPaths[1]} "${filePath}"`;

      exec(compileCommand, (compileErr, compileStdout, compileStderr) => {
        if (compileErr) {
          console.error(
            `[${jobId}] Java compilation failed:`,
            compileStderr.toString()
          );

          const errorStr = compileStderr.toString();
          const lineMatch = errorStr.match(/:(\d+):/);
          const line = lineMatch ? parseInt(lineMatch[1]) : null;

          // Cleanup
          fileService.cleanupFiles([filePath, inputPath]);

          return reject({
            type: "compilation",
            message: errorStr,
            line,
            jobId,
          });
        }


        // Step 2: Execute Java class
        const javaExePath = '"C:\\Program Files\\Java\\jdk-24\\bin\\java.exe"';
        const execCommand = `${javaExePath} -cp "${classDir}" ${expectedClassName} < "${inputPath}"`;
        console.log(`[${jobId}] Execution command: ${execCommand}`);

        exec(
          execCommand,
          {
            timeout: EXECUTION_TIMEOUT,
            cwd: classDir, // Set working directory to class directory
          },
          (runtimeErr, stdout, runtimeStderr) => {
            // Cleanup files
            fileService.cleanupFiles([filePath, inputPath, classPath]);

            if (runtimeErr) {
              console.error(
                `[${jobId}] Java execution failed:`,
                runtimeErr.message
              );

              if (runtimeErr.killed) {
                return reject({
                  type: "runtime",
                  message: `Program execution timed out (${
                    EXECUTION_TIMEOUT / 1000
                  } seconds limit)`,
                  line: null,
                  jobId,
                });
              }

              const errorStr = runtimeStderr.toString() || runtimeErr.message;
              console.error(`[${jobId}] Runtime error details:`, errorStr);

              return reject({
                type: "runtime",
                message: errorStr,
                line: null,
                jobId,
              });
            }

            resolve(stdout);
          }
        );
      });
    });
  }
}

module.exports = new JavaExecutor();
