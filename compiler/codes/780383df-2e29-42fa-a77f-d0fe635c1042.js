const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on("line", (line) => {
    lines.push(line);
    if (lines.length === 3) {
        const n = parseInt(lines[0]);
        const nums = lines[1].split(" ").map(Number);
        const target = parseInt(lines[2]);

        const map = new Map();
        for (let i = 0; i < n; i++) {
            const complement = target - nums[i];
            if (map.has(complement)) {
                console.log(map.get(complement), i);
                process.exit();
            }
            map.set(nums[i], i);
        }
    }
});
