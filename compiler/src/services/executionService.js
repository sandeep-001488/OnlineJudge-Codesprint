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
    const output = await executor(filePath, inputPath, jobId);
    return output;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  executeCode,
};
