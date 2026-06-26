const fs = require('fs');

const tsFile = 'src/data/questions.ts';
let code = fs.readFileSync(tsFile, 'utf8');

const expText = fs.readFileSync('test2_explanations.txt', 'utf8');

// The explanations are separated by MODULE ...
// For Reading, it's ## Question 1
// For Math, it's Question 1
const sections = expText.split(/(?:# SECTION .*? — MODULE .*? \([^)]*\) — \d+ Questions|MODULE 1 \(\d+ Questions\)|MODULE 2 — HARD \(\d+ Questions\))/);

const exps = [{}, {}, {}, {}]; // R1, R2, M1, M2

const parseExps = (sectionStr, map, isMath) => {
    if (!sectionStr) return;
    const regex = isMath ? /^Question (\d+) —/gm : /^## Question (\d+) —/gm;
    let match;
    let lastIndex = 0;
    let lastQ = null;
    
    while ((match = regex.exec(sectionStr)) !== null) {
        if (lastQ !== null) {
            map[lastQ] = sectionStr.substring(lastIndex, match.index).trim();
        }
        lastQ = parseInt(match[1]);
        lastIndex = match.index + match[0].length;
    }
    if (lastQ !== null) {
        map[lastQ] = sectionStr.substring(lastIndex).trim();
    }
};

parseExps(sections[1], exps[0], false);
parseExps(sections[2], exps[1], false);
parseExps(sections[3], exps[2], true);
parseExps(sections[4], exps[3], true);

console.log("Parsed explanation counts:", Object.keys(exps[0]).length, Object.keys(exps[1]).length, Object.keys(exps[2]).length, Object.keys(exps[3]).length);

// Now we need to modify questions.ts using regex to add explanation field.
// We can find each question by its id: "id": "pt2-reading-m1-q1",
const injectExps = (moduleStr, map) => {
    Object.keys(map).forEach(qnum => {
        let expl = map[qnum].replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        // Find: "id": "moduleStr-qNUM", ... "difficulty": "..."
        const qRegex = new RegExp(`("id":\\s*"${moduleStr}-q${qnum}",[\\s\\S]*?"difficulty":\\s*"[^"]*")(\\s*\\})`, 'g');
        code = code.replace(qRegex, `$1,\n        "explanation": "${expl}"$2`);
    });
};

injectExps("pt2-reading-m1", exps[0]);
injectExps("pt2-reading-m2", exps[1]);
injectExps("pt2-math-m1", exps[2]);
injectExps("pt2-math-m2", exps[3]);

fs.writeFileSync(tsFile, code);
console.log("Injected all explanations!");
