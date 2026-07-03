const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/ebrw_bank.json', 'utf8'));
let count = 0;
const fixedIds = [];

for (const q of data) {
    if (q.id === "a15b3219" || q.id === "702eb7e3") { // Just check a few to see what needs fixing
        console.log("Original passage:", JSON.stringify(q.passage));
    }
    
    if (q.image || q.imageUrl) {
        if (q.passage) {
            let original = q.passage;
            // Remove text that appears in the image (like the title of the chart)
            // It seems "Municipalities’ Responses to Inquiries about Potential Incentives for Firm\n\n" is left over.
            
            // Let's remove the first line if it's followed by \n\n and doesn't end with punctuation
            let lines = q.passage.split('\n\n');
            if (lines.length > 1 && !lines[0].match(/[.!?]$/)) {
                // If it looks like a title, remove it
                q.passage = lines.slice(1).join('\n\n');
                if (original !== q.passage) {
                    count++;
                    fixedIds.push(q.id);
                }
            }
        }
    }
}

fs.writeFileSync('src/data/ebrw_bank.json', JSON.stringify(data, null, 2));
console.log(`Fixed ${count} passages by removing title lines`);
// console.log(fixedIds.join(', '));
