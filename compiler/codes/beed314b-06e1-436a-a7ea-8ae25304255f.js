const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = "";

rl.on("line", (line) => {
  input += line.trim();
  rl.close();
});

rl.on("close", () => {
  const s = input;
  const n = s.length;

  const sumIndex = new Map();
  sumIndex.set(0, -1);
  let maxLen = 0, prefixSum = 0;

  for (let i = 0; i < n; i++) {
    prefixSum += s[i] === '0' ? -1 : 1;
    if (sumIndex.has(prefixSum)) {
      maxLen = Math.max(maxLen, i - sumIndex.get(prefixSum));
    } else {
      sumIndex.set(prefixSum, i);
    }
  }

  console.log(maxLen);
});
