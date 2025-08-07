const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
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
