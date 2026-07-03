const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, 'src/data/math_bank.json');

function main() {
    const data = JSON.parse(fs.readFileSync(BANK_PATH, 'utf8'));
    let patchedCount = 0;

    data.forEach(q => {
        if (q.question && q.question.includes('![image]')) {
            // Find and remove <table>...</table>
            const original = q.question;
            const updated = original.replace(/<table>[\s\S]*?<\/table>\s*/i, '');
            if (original !== updated) {
                q.question = updated;
                patchedCount++;
            }
        }
        
        // Also check options if needed, though they rarely have tables, we can do it just in case
        if (q.options && Array.isArray(q.options)) {
            q.options.forEach((opt, idx) => {
                if (typeof opt === 'string' && opt.includes('![image]')) {
                    const original = opt;
                    const updated = original.replace(/<table>[\s\S]*?<\/table>\s*/i, '');
                    if (original !== updated) {
                        q.options[idx] = updated;
                        patchedCount++;
                    }
                }
            });
        }
    });

    fs.writeFileSync(BANK_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Removed tables from ${patchedCount} entries containing images.`);
}

main();
