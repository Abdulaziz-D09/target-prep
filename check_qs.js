const fs = require('fs');
const content = fs.readFileSync('src/data/questions.ts', 'utf8');

// We'll use regex to roughly count 'type: "Reading"' and how many have passages.
const readingQs = content.match(/type:\s*"Reading"/g) || [];
console.log(`Total Reading questions: ${readingQs.length}`);

// Let's count how many passages are empty or very short
let match;
let emptyPassages = 0;
const passageRe = /passage:\s*"([^"]*)"/g;
let passageCount = 0;
while ((match = passageRe.exec(content)) !== null) {
    passageCount++;
    if (match[1].length < 10) emptyPassages++;
}
console.log(`Total passages: ${passageCount}`);
console.log(`Empty or short passages: ${emptyPassages}`);
