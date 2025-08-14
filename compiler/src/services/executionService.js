const { generateFile } = require("./fileService");
const { executeCpp } = require("./languageExecutors/cppExecutor");
const { executePython } = require("./languageExecutors/pythonExecutor");
const { executeJava } = require("./languageExecutors/javaExecutor");
const { executeJavascript } = require("./languageExecutors/javascriptExecutor");

const executors = {
  cpp: executeCpp,
  python: executePython,
  java: executeJava,
  javascript: executeJavascript,
};

const executeCode = async (language, code, input) => {
  const executor = executors[language];

  if (!executor) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const { filePath, inputPath, jobId } = generateFile(language, code, input);

  try {
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage().heapUsed;

    const result = await executor(filePath, inputPath, jobId);

    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage().heapUsed;

    const executionTime = Number(endTime - startTime) / 1_000_000;
    const memoryUsedKB = Math.round((endMemory - startMemory) / 1024); 

    return {
      output: result,
      executionTime,
      memoryUsed: memoryUsedKB < 0 ? 0 : memoryUsedKB,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  executeCode,
};
