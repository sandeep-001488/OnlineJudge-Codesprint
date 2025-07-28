const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const { CODES_DIR, FILE_EXTENSIONS } = require("../config/constants");

class FileService {
  constructor() {
    this.ensureDirectoriesExist();
  }

  ensureDirectoriesExist() {
    if (!fs.existsSync(CODES_DIR)) {
      fs.mkdirSync(CODES_DIR, { recursive: true });
    }
  }

  generateFile(language, code, input = "") {
    const jobId = uuid();
    const extension = FILE_EXTENSIONS[language];

    if (!extension) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const fileName = `${jobId}.${extension}`;
    const filePath = path.join(CODES_DIR, fileName);
    const inputPath = path.join(CODES_DIR, `${jobId}_input.txt`);

    try {
      fs.writeFileSync(filePath, code);
      fs.writeFileSync(inputPath, input);

      return { filePath, inputPath, jobId };
    } catch (error) {
      throw new Error(`Failed to create files: ${error.message}`);
    }
  }

  cleanupFiles(filePaths) {
    filePaths.forEach((filePath) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.warn(`Cleanup error for ${filePath}:`, error.message);
      }
    });
  }
}

module.exports = new FileService();
