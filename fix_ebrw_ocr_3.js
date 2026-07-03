const fs = require('fs');
const ebrw = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));

for (const q of ebrw) {
    if (q.id === '1281dfd5') {
        q.passage = q.passage.replace(/<!--[\s\S]*?-->\s*/g, '');
    }
}

fs.writeFileSync('src/data/ebrw_bank.json', JSON.stringify(ebrw, null, 2));
console.log('Fixed EBRW 1281dfd5 passage properly!');
