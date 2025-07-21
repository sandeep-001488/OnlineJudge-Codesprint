const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (format, content, input) => {
  const jobId = uuid();
  const fileName = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  const inputPath = path.join(dirCodes, `${jobId}_input.txt`);
  fs.writeFileSync(filePath, content);
  fs.writeFileSync(inputPath, input);
  return { filePath, inputPath };
};

module.exports = { generateFile };
