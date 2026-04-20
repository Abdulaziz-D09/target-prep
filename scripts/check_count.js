const fs = require('fs');

const d = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));

let count = 0;
for (const q of d) {
    const qt = (q.question || '').toLowerCase();
    const pt = (q.passage || '').toLowerCase();
    const qn = qt.replace(/\s+/g, '');

    if (qn.includes('conformstotheconventions') || qn.includes('conformstoconventions') || qt.includes('confor') || qt.includes('punctuat') || qt.includes('punc') || qt.includes('comma') || qt.includes('semicolon') || qt.includes('colon') || qt.includes('apostrophe') || qt.includes('dash') || qt.includes('fragment') || qt.includes('run-on') || qt.includes('boundary')) {
        // Boundaries
    }
    else if (qn.includes('withthecorrect') || qt.includes('verb') || qt.includes('tense') || qt.includes('pronoun') || qt.includes('modifier') || qt.includes('possessive') || qt.includes('agreement') || qt.includes('clause') || qt.includes('parallel') || qt.includes('grammatically')) {
        count++;
    }
}
console.log("Count:", count);
