const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, 'src/data/math_bank.json');
const IMAGES_DIR = path.join(__dirname, 'public/math-bank');

function main() {
    const data = JSON.parse(fs.readFileSync(BANK_PATH, 'utf8'));
    const files = fs.readdirSync(IMAGES_DIR);

    let qCount = 0;
    let oCount = 0;

    // Create lookup for questions
    const qMap = new Map();
    data.forEach(q => qMap.set(q.id, q));

    files.forEach(file => {
        if (file === '.DS_Store') return;
        
        // Remove trailing extension and any leading/trailing whitespace
        const baseName = file.replace(/\.[^/.]+$/, "").trim(); 
        
        // Match patterns like "1a1a95de" or "1a1a95de(a)" or "1a1a95de (b)"
        const match = baseName.match(/^([a-zA-Z0-9]+)(?:\s*\(([a-d])\))?$/i);
        if (!match) {
            console.log(`Skipping unrecognizable format: ${file}`);
            return;
        }

        const id = match[1];
        const option = match[2] ? match[2].toLowerCase() : null;

        const q = qMap.get(id);
        if (!q) {
            console.log(`Question ID ${id} not found for image ${file}`);
            return;
        }

        const imgStr = `\n\n![image](/math-bank/${file})`;

        if (!option) {
            // It's for the question
            if (!q.question.includes(file)) {
                q.question += imgStr;
                qCount++;
            }
        } else {
            // It's for an option
            const idx = option.charCodeAt(0) - 'a'.charCodeAt(0);
            if (q.options && Array.isArray(q.options) && q.options.length > idx) {
                if (!q.options[idx].includes(file)) {
                    q.options[idx] += imgStr;
                    oCount++;
                }
            } else {
                console.log(`Option ${option} not found for ID ${id} (file: ${file})`);
            }
        }
    });

    fs.writeFileSync(BANK_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Added ${qCount} images to questions and ${oCount} images to options.`);
}

main();
