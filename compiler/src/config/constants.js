const path = require("path");

module.exports = {
  PORT: process.env.PORT || 8000,
  EXECUTION_TIMEOUT: 10000, 
  CODES_DIR: path.join(__dirname, "../../codes"),
  OUTPUTS_DIR: path.join(__dirname, "../../outputs"),
  SUPPORTED_LANGUAGES: ["cpp", "python", "java", "javascript"],
  FILE_EXTENSIONS: {
    cpp: "cpp",
    python: "py",
    java: "java",
    javascript: "js",
  },
};
