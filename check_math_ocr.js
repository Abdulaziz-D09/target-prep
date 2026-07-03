const fs = require('fs');
const math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

console.log("--- MATH Questions with Images ---");
for (const q of math) {
    if (q.image && q.question) {
        const parts = q.question.split('\n\n');
        if (parts.length > 1) {
            console.log(`ID: ${q.id}`);
            console.log(`First part: ${parts[0]}`);
            console.log(`Length: ${parts[0].length}`);
            console.log("-----");
        }
    }
}
