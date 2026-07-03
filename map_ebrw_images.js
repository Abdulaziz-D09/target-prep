const fs = require('fs');
const path = require('path');

const bankPath = 'src/data/ebrw_bank.json';
const imgDir = 'public/question-images';

const data = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

let mapped = 0;
data.forEach(q => {
    const imgPathPng = path.join(imgDir, `${q.id}.png`);
    const imgPathJpg = path.join(imgDir, `${q.id}.jpg`);
    
    if (fs.existsSync(imgPathPng)) {
        q.image = `/question-images/${q.id}.png`;
        mapped++;
    } else if (fs.existsSync(imgPathJpg)) {
        q.image = `/question-images/${q.id}.jpg`;
        mapped++;
    }
});

fs.writeFileSync(bankPath, JSON.stringify(data, null, 2));
console.log(`Successfully mapped ${mapped} images to English questions.`);
