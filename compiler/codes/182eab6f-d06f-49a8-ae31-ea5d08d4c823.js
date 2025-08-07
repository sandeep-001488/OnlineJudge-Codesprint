const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const s = input.trim();
    const n = s.length;
    
    if (n === 0) {
        console.log(0);
        rl.close();
        return;
    }
    
    const sumIndex = new Map();
    sumIndex.set(0, -1);
    
    let maxLen = 0;
    let prefixSum = 0;
    
    for (let i = 0; i < n; i++) {
        prefixSum += (s[i] === '0') ? -1 : 1;
        
        if (sumIndex.has(prefixSum)) {
            maxLen = Math.max(maxLen, i - sumIndex.get(prefixSum));
        } else {
            sumIndex.set(prefixSum, i);
        }
    }
    
    console.log(maxLen);
    rl.close();
});