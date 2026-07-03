const fs = require('fs');
const path = require('path');

const bankPath = 'src/data/math_bank.json';
const imgDir = 'public/math-bank';

const data = JSON.parse(fs.readFileSync(bankPath, 'utf8'));

let mapped = 0;
data.forEach(q => {
    const imgPath = path.join(imgDir, `${q.id}.jpg`);
    const imgPathPng = path.join(imgDir, `${q.id}.png`);
    
    if (fs.existsSync(imgPath)) {
        q.image = `/math-bank/${q.id}.jpg`;
        mapped++;
    } else if (fs.existsSync(imgPathPng)) {
        q.image = `/math-bank/${q.id}.png`;
        mapped++;
    }
});

fs.writeFileSync(bankPath, JSON.stringify(data, null, 2));
console.log(`Successfully mapped ${mapped} images to Math questions.`);
