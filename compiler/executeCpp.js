const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
  });
};


// const filePath =
//   "C:/Users/STC/Desktop/next.Js/OnlineJudge-CodeSprint/compiler/codes/ba4e27ef-c589-42aa-8444-edfb117a7e4a.cpp";

// executeCpp(filePath)
//   .then((output) => {
//     console.log(" Compilation and Execution Success:\n", output);
//   })
//   .catch((err) => {
//     console.error(" Compilation or Execution Failed:\n", err);
//   });

module.exports = { executeCpp };
