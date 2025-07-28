const fileService = require("./fileService");
const cppExecutor = require("./languageExecutors/cppExecutor");
const pythonExecutor = require("./languageExecutors/pythonExecutor");
const javaExecutor = require("./languageExecutors/javaExecutor");
const javascriptExecutor = require("./languageExecutors/javascriptExecutor");

class ExecutionService {
  constructor() {
    this.executors = {
      cpp: cppExecutor,
      python: pythonExecutor,
      java: javaExecutor,
      javascript: javascriptExecutor,
    };
  }

  async executeCode(language, code, input) {
    const executor = this.executors[language];

    if (!executor) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const { filePath, inputPath, jobId } = fileService.generateFile(
      language,
      code,
      input
    );

    try {
      const output = await executor.execute(filePath, inputPath, jobId);
      return output;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExecutionService();
