const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));

const index = data.findIndex(q => q.id === '403fb4e4');
console.log("Index in ebrw_bank.json:", index);
console.log("Human number (Index + 1):", index + 1);

// Also check how questions.ts exports it
const tsContent = fs.readFileSync('src/data/questions.ts', 'utf8');
const idMatch = tsContent.indexOf("'403fb4e4'");
if (idMatch !== -1) {
    console.log("Found in questions.ts at index", idMatch);
} else {
    console.log("Not found in questions.ts directly, perhaps imported from json.");
}
