const fs = require('fs');

const dataPath = 'src/data/math_bank.json';
const bankPath = 'public/math-bank';

const data = JSON.parse(fs.readFileSync(dataPath));
const files = fs.readdirSync(bankPath);

let modified = false;

files.forEach(f => {
    if (f.startsWith('.')) return;
    
    // Extract name without extension
    const extIndex = f.lastIndexOf('.');
    const nameWithoutExt = extIndex > 0 ? f.substring(0, extIndex) : f;
    
    // Match ID and optional (a), (b), (c), (d)
    const match = nameWithoutExt.match(/^([a-zA-Z0-9]+)(\(([a-dA-D])\))?$/);
    if (!match) return;
    
    const id = match[1];
    const option = match[3];
    
    const q = data.find(x => x.id === id);
    if (!q) return;
    
    if (!option) {
        // Question image
        const imgPath = `/math-bank/${f}`;
        if (q.image !== imgPath) {
            q.image = imgPath;
            modified = true;
        }
        
        // Ensure no markdown image inside the question if it's identical
        const mdImg = `![image](${imgPath})`;
        if (q.question && q.question.includes(mdImg)) {
             q.question = q.question.replace(mdImg, '').trim();
             modified = true;
        }
    } else {
        // Option image
        const optIndex = option.toLowerCase().charCodeAt(0) - 97;
        if (q.options && q.options.length > optIndex) {
            const imgTag = `![image](/math-bank/${f})`;
            if (!q.options[optIndex].includes(imgTag)) {
                q.options[optIndex] = imgTag + '\n' + q.options[optIndex];
                modified = true;
            }
        }
    }
});

if (modified) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('Math bank updated with images from public/math-bank!');
} else {
    console.log('No updates needed.');
}
