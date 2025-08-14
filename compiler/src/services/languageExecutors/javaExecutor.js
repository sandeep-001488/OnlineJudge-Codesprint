const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { cleanupFiles } = require("../fileService");
const { EXECUTION_TIMEOUT } = require("../../config/constants");

const executeJava = async (filePath, inputPath, jobId) => {
  return new Promise((resolve, reject) => {
    const rawClassName = path.basename(filePath, ".java");
    let expectedClassName = rawClassName.replace(/[^a-zA-Z0-9_$]/g, "_");

    if (/^\d/.test(expectedClassName)) {
      expectedClassName = "_" + expectedClassName;
    }

    const classDir = path.dirname(filePath);
    const classPath = path.join(classDir, `${expectedClassName}.class`);

    try {
      let javaCode = fs.readFileSync(filePath, "utf8");
      const classNameMatch = javaCode.match(/public\s+class\s+(\w+)/);
      const actualClassName = classNameMatch ? classNameMatch[1] : null;

      if (actualClassName && actualClassName !== expectedClassName) {
        javaCode = javaCode.replace(
          new RegExp(`public\\s+class\\s+${actualClassName}\\b`, "g"),
          `public class ${expectedClassName}`
        );
        fs.writeFileSync(filePath, javaCode);
        const newFilePath = path.join(classDir, `${expectedClassName}.java`);
        fs.renameSync(filePath, newFilePath);
        filePath = newFilePath;
      }
    } catch (readError) {
      console.error(`[${jobId}] Error reading Java file:`, readError.message);
      cleanupFiles([filePath, inputPath]);
      return reject({
        type: "compilation",
        message: `Error reading Java file: ${readError.message}`,
        line: null,
        jobId,
      });
    }

    const compileCommand = `javac "${filePath}"`;

    exec(compileCommand, (compileErr, compileStdout, compileStderr) => {
      if (compileErr) {
        const errorStr = compileStderr.toString();
        const lineMatch = errorStr.match(/:(\d+):/);
        const line = lineMatch ? parseInt(lineMatch[1]) : null;

        cleanupFiles([filePath, inputPath]);
        return reject({
          type: "compilation",
          message: errorStr,
          line,
          jobId,
        });
      }

      const execCommand = `java -cp "${classDir}" ${expectedClassName} < "${inputPath}"`;

      exec(
        execCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: classDir },
        (runtimeErr, stdout, runtimeStderr) => {
          cleanupFiles([filePath, inputPath, classPath]);

          if (runtimeErr) {
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
};

module.exports = {
  executeJava,
};




// for windows

// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// const { cleanupFiles } = require("../fileService");
// const { EXECUTION_TIMEOUT } = require("../../config/constants");

// const executeJava = async (filePath, inputPath, jobId) => {

//   return new Promise((resolve, reject) => {
//     const rawClassName = path.basename(filePath, ".java");
//     let expectedClassName = rawClassName.replace(/[^a-zA-Z0-9_$]/g, "_");

//     if (/^\d/.test(expectedClassName)) {
//       expectedClassName = "_" + expectedClassName;
//     }

//     const classDir = path.dirname(filePath);
//     const classPath = path.join(classDir, `${expectedClassName}.class`);

//     try {
//       let javaCode = fs.readFileSync(filePath, "utf8");
//       const classNameMatch = javaCode.match(/public\s+class\s+(\w+)/);
//       const actualClassName = classNameMatch ? classNameMatch[1] : null;

//       if (actualClassName && actualClassName !== expectedClassName) {
//         javaCode = javaCode.replace(
//           new RegExp(`public\\s+class\\s+${actualClassName}\\b`, "g"),
//           `public class ${expectedClassName}`
//         );
//         fs.writeFileSync(filePath, javaCode);
//         const newFilePath = path.join(classDir, `${expectedClassName}.java`);
//         fs.renameSync(filePath, newFilePath);
//         filePath = newFilePath;
//       }
//     } catch (readError) {
//       console.error(`[${jobId}] Error reading Java file:`, readError.message);
//       cleanupFiles([filePath, inputPath]);
//       return reject({
//         type: "compilation",
//         message: `Error reading Java file: ${readError.message}`,
//         line: null,
//         jobId,
//       });
//     }

//     const tryCompile = (javacCmd, javaCmd) => {
//       const compileCommand = `${javacCmd} "${filePath}"`;

//       exec(compileCommand, (compileErr, compileStdout, compileStderr) => {
//         if (compileErr) {
//           const errorStr = compileStderr.toString();
//           const lineMatch = errorStr.match(/:(\d+):/);
//           const line = lineMatch ? parseInt(lineMatch[1]) : null;

//           cleanupFiles([filePath, inputPath]);
//           return reject({
//             type: "compilation",
//             message: errorStr,
//             line,
//             jobId,
//           });
//         }

//         const execCommand = `${javaCmd} -cp "${classDir}" ${expectedClassName} < "${inputPath}"`;

//         exec(
//           execCommand,
//           { timeout: EXECUTION_TIMEOUT, cwd: classDir },
//           (runtimeErr, stdout, runtimeStderr) => {
//             cleanupFiles([filePath, inputPath, classPath]);

//             if (runtimeErr) {
//               if (runtimeErr.killed) {
//                 return reject({
//                   type: "runtime",
//                   message: `Program execution timed out (${
//                     EXECUTION_TIMEOUT / 1000
//                   } seconds limit)`,
//                   line: null,
//                   jobId,
//                 });
//               }

//               const errorStr = runtimeStderr.toString() || runtimeErr.message;
//               return reject({
//                 type: "runtime",
//                 message: errorStr,
//                 line: null,
//                 jobId,
//               });
//             }

//             resolve(stdout);
//           }
//         );
//       });
//     };

//     exec("javac -version", (err) => {
//       if (!err) {
//         tryCompile("javac", "java");
//       } else {
//         const javaPath = '"C:\\Program Files\\Java\\jdk-17\\bin';
//         tryCompile(`${javaPath}\\javac.exe"`, `${javaPath}\\java.exe"`);
//       }
//     });
//   });
// };

// module.exports = {
//   executeJava,
// };
