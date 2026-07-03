const fs = require('fs');
const oldData = JSON.parse(fs.readFileSync('old_math_bank.json', 'utf8'));
const newData = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

let restoredCount = 0;

for (let i = 0; i < newData.length; i++) {
    const q = newData[i];
    const oldQ = oldData.find(x => x.id === q.id);
    if (oldQ) {
        // If the current question has "61941" anywhere, restore the text from oldQ
        let needsRestore = false;
        
        if (q.question && q.question.includes('61941')) {
            q.question = oldQ.question;
            needsRestore = true;
        }
        
        if (q.options) {
            for (let j = 0; j < q.options.length; j++) {
                if (q.options[j].includes('61941')) {
                    if (oldQ.options && oldQ.options[j]) {
                        q.options[j] = oldQ.options[j];
                        needsRestore = true;
                    }
                }
            }
        }
        
        if (q.explanation && q.explanation.includes('61941')) {
            q.explanation = oldQ.explanation;
            needsRestore = true;
        }

        // Also restore if it had `61941` but it was just numbers.
        if (needsRestore) restoredCount++;
        
        // Let's also ALWAYS restore the text from oldQ, but KEEP the `image` field if we added it in newData!
        // Actually, the user's manual edits (like `image` or `imageLayout` or fixed typos) might be in newData.
        // Wait, did the user make manual text edits between Jun 4 and today? 
        // If they did, they are corrupted by 61941 if they contained a dollar amount.
    }
}
fs.writeFileSync('src/data/math_bank_fixed.json', JSON.stringify(newData, null, 2));
console.log('Restored corrupted fields for', restoredCount, 'questions.');
