const fs = require('fs');
const content = fs.readFileSync('src/app/practice/test/[id]/page.tsx', 'utf-8');
const lines = content.split('\n');
const effectLine = lines.findIndex(l => l.includes('const saved = readActiveSession();'));
console.log(lines.slice(effectLine, effectLine + 20).join('\n'));
