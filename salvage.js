const fs = require('fs');
const content = fs.readFileSync('tmp_math_bank_chunk.js', 'utf8');

const parsePrefix = "JSON.parse('";
let searchIndex = 0;
let found = 0;

while (true) {
    const startIdx = content.indexOf(parsePrefix, searchIndex);
    if (startIdx === -1) break;
    
    const jsonStart = startIdx + parsePrefix.length;
    let endIdx = content.indexOf("')", jsonStart);
    
    while (endIdx !== -1) {
        let jsonStr = content.substring(jsonStart, endIdx);
        jsonStr = jsonStr.replace(/\\'/g, "'").replace(/\\\\/g, "\\");
        
        try {
            const parsed = JSON.parse(jsonStr);
            console.log(`Found array with length: ${parsed.length}`);
            
            const isMath = parsed.some(q => q.domain && (q.domain.includes('Algebra') || q.domain.includes('Math')));
            if (isMath) {
                console.log('This is math_bank.json!');
                fs.writeFileSync('src/data/math_bank.json', JSON.stringify(parsed, null, 2));
                found++;
            }
            break; // found the right closing brace
        } catch (e) {
            // Probably not the right closing quote, find the next one
            endIdx = content.indexOf("')", endIdx + 1);
        }
    }
    searchIndex = startIdx + parsePrefix.length;
}
console.log('Saved', found, 'files.');
