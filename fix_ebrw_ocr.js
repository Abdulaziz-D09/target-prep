const fs = require('fs');
const ebrw = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));

for (const q of ebrw) {
    if (q.id === '702eb7e3') {
        q.passage = q.passage.replace('(larger values = more uncertainty)\n\n', '');
    }
    if (q.id === '1281dfd5') {
        // Find the end of the HTML comment and the newline
        const endIndex = q.passage.indexOf('-->\n\n');
        if (endIndex !== -1) {
            q.passage = q.passage.substring(endIndex + 5);
        }
    }
    if (q.id === 'a9040290') {
        q.passage = q.passage.replace('[ ] West [x] Midwest\n\n', '');
    }
    if (q.id === '5d453dcc') {
        q.passage = q.passage.replace('\\* 1 = strong Democrat/liberal; 4 = independent; 7 = strong Republican/conservative\n\n', '');
    }
    if (q.id === 'e441da80') {
        q.passage = q.passage.replace('Total legend icon\n\n', '');
    }
}

fs.writeFileSync('src/data/ebrw_bank.json', JSON.stringify(ebrw, null, 2));
console.log('Fixed EBRW passages!');
