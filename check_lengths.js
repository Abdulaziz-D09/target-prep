const fs = require('fs');
const content = fs.readFileSync('src/data/questions.ts', 'utf8');

function countArr(name) {
    const idx = content.indexOf(`const ${name}: Question[] = [`);
    if (idx === -1) return -1;
    let braceLevel = 0;
    let start = -1;
    for (let i = idx; i < content.length; i++) {
        if (content[i] === '[') {
            if (braceLevel === 0) start = i;
            braceLevel++;
        } else if (content[i] === ']') {
            braceLevel--;
            if (braceLevel === 0) {
                const arrStr = content.slice(start, i + 1);
                const qCount = (arrStr.match(/id:/g) || []).length;
                return qCount;
            }
        }
    }
    return -1;
}

console.log('em1:', countArr('englishModule1'));
console.log('em2e:', countArr('englishModule2Easy'));
console.log('em2h:', countArr('englishModule2Hard'));

