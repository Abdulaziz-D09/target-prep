const fs = require('fs');
const ebrwData = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));

// Assuming all items in ebrw_bank are English questions
const englishQuestions = ebrwData;

const index = englishQuestions.findIndex(q => q.id === '403fb4e4');
console.log("Global English Index (0-based):", index);
console.log("Global English Number (1-based):", index + 1);

// What is the skill and domain?
const q = englishQuestions[index];
console.log("Skill:", q.skill);
console.log("Domain:", q.domain);
