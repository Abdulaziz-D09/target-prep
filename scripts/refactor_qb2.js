const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/app/question-bank/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// The problematic lines
content = content.replace(/const allEnglishQuestions: Question\[\] = \(ebrwData as RawBankQuestion\[\]\)[\s\S]*?\}\);/m, "");
content = content.replace(/const allMathQuestions: Question\[\] = \[[\s\S]*?\}\)\);/m, "");

fs.writeFileSync(file, content);
console.log('Refactor 2 complete.');
