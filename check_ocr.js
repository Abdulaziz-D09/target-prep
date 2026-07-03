const fs = require('fs');
const ebrw = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));

console.log("--- EBRW Questions with Images (First lines) ---");
for (const q of ebrw) {
    if (q.image && q.passage) {
        const parts = q.passage.split('\n');
        if (parts.length > 1) {
            console.log(`ID: ${q.id}`);
            console.log(`First part: ${parts[0]}`);
            console.log("-----");
        }
    }
}
