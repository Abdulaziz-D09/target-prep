const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));
let count = 0;
const fixedIds = [];

for (const q of data) {
    if (q.image || q.imageUrl) {
        if (q.passage && q.passage.includes('<table')) {
            // Regex to remove <table>...</table>
            q.passage = q.passage.replace(/<table[\s\S]*?<\/table>/gi, '').trim();
            // Also remove multiple newlines left behind
            q.passage = q.passage.replace(/\n{3,}/g, '\n\n');
            count++;
            fixedIds.push(q.id);
        }
    }
}

fs.writeFileSync('src/data/ebrw_bank.json', JSON.stringify(data, null, 2));
console.log(`Fixed ${count} questions`);
console.log(fixedIds.join(', '));
