const fs = require('fs');
// Very naive way, let's just parse it using a small ast or regex.
// Actually, I can just require the transpiled TS or use ts-node.
// Wait, target-prep has ts-node? Let's just write a regex script.
const content = fs.readFileSync('src/data/questions.ts', 'utf8');

const pt1Match = content.indexOf('title: "Practice Test 1"');
const pt2Match = content.indexOf('title: "Practice Test 2"');

console.log("PT1 found at index:", pt1Match);
console.log("PT2 found at index:", pt2Match);

