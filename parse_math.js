const fs = require('fs');

const qsText = fs.readFileSync('test2_questions.txt', 'utf8');
const expText = fs.readFileSync('test2_explanations.txt', 'utf8');

const answers = { 1: {}, 2: {} };
const explanations = { 1: {}, 2: {} };
let currentModuleForExp = 1;
let currentQuestionForExp = null;
let currentExpLines = [];

// Parse Math explanations
expText.split('\n').forEach(line => {
    if (line.includes('Section 2, Module 1: Math')) currentModuleForExp = 1;
    else if (line.includes('Section 2, Module 2: Math')) currentModuleForExp = 2;
    // Skip English sections
    if (line.includes('Section 1')) return;
    
    const qMatch = line.match(/^## Question (\d+)/);
    if (qMatch) {
        if (currentQuestionForExp !== null) {
            explanations[currentModuleForExp][currentQuestionForExp] = currentExpLines.join('\n').trim();
        }
        currentQuestionForExp = parseInt(qMatch[1]);
        currentExpLines = [];
        
        // Extract answer: e.g. "Answer: **C**" or "Answer: 45"
        const ansMatch = line.match(/Answer:\s*\*?\*?([A-D]|\d+|-\d+|\d+\/\d+|\d+\.\d+)/);
        if (ansMatch) {
            const val = ansMatch[1];
            if (['A', 'B', 'C', 'D'].includes(val)) {
                answers[currentModuleForExp][currentQuestionForExp] = val.charCodeAt(0) - 65;
            } else {
                // Free response
                answers[currentModuleForExp][currentQuestionForExp] = val;
            }
        }
    } else if (currentQuestionForExp !== null && !line.startsWith('---') && !line.startsWith('End of')) {
        currentExpLines.push(line);
    }
});
if (currentQuestionForExp !== null) {
    explanations[currentModuleForExp][currentQuestionForExp] = currentExpLines.join('\n').trim();
}

const modules = [ { timeMinutes: 35, questions: [] }, { timeMinutes: 35, questions: [] } ];
const sections = qsText.split(/## Section 2, Module \d.*?\n/);

for (let m = 1; m <= 2; m++) {
    if (!sections[m]) continue;
    const blocks = sections[m].split(/\n(?=\d+\.\s+)/);
    blocks.forEach(block => {
        block = block.trim();
        if (!block) return;
        const qNumMatch = block.match(/^(\d+)\.\s*/);
        if (!qNumMatch) return;
        const qNum = parseInt(qNumMatch[1]);
        
        let promptText = block.replace(/^\d+\.\s*/, '');
        let finalOptions = [];
        
        const optionRegex = /A\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)/s;
        const matchOpts = promptText.match(optionRegex);
        if (matchOpts) {
            finalOptions = [matchOpts[1].trim(), matchOpts[2].trim(), matchOpts[3].trim(), matchOpts[4].trim()];
            promptText = promptText.replace(optionRegex, '').trim();
        } else {
            const aIdx = promptText.lastIndexOf('\nA.');
            if (aIdx !== -1) {
                const optStr = promptText.substring(aIdx);
                promptText = promptText.substring(0, aIdx).trim();
                const bIdx = optStr.indexOf('\nB.');
                const cIdx = optStr.indexOf('\nC.');
                const dIdx = optStr.indexOf('\nD.');
                
                if (bIdx !== -1 && cIdx !== -1 && dIdx !== -1) {
                    finalOptions = [
                        optStr.substring(3, bIdx).trim(),
                        optStr.substring(bIdx + 3, cIdx).trim(),
                        optStr.substring(cIdx + 3, dIdx).trim(),
                        optStr.substring(dIdx + 3).trim()
                    ];
                }
            }
        }
        
        let ans = answers[m][qNum];
        if (ans === undefined) ans = -1;
        
        modules[m-1].questions.push({
            id: `pt2-math-m${m}-q${qNum}`,
            type: "Math",
            question: promptText,
            options: finalOptions,
            answer: ans,
            explanation: explanations[m][qNum] || "",
            difficulty: m === 1 ? "Medium" : "Hard"
        });
    });
}

// Now write it into questions.ts
let src = fs.readFileSync('src/data/questions.ts', 'utf8');

// Find where Test 2 ends (after its Reading/Writing section).
// We'll replace the sections array for Test 2.
const test2Idx = src.indexOf('id: 2,');
const sectionsStart = src.indexOf('sections: [', test2Idx);
// Find the end of Test 2 definition by looking for the next Practice Test or end of file
const nextTestIdx = src.indexOf('id: 3,', test2Idx);
const test2Chunk = src.substring(test2Idx, nextTestIdx !== -1 ? nextTestIdx : src.length);

const rwSectionEndMatch = test2Chunk.match(/difficulty:\s*"[^"]+"\s*}\s*]\s*}\s*]\s*}/);
if (rwSectionEndMatch) {
    const insertIdx = test2Idx + rwSectionEndMatch.index + rwSectionEndMatch[0].length;
    
    // We append the Math section here
    const mathSectionStr = `,\n  {\n    name: "Math",\n    modules: ${JSON.stringify(modules, null, 6).replace(/"([^"]+)":/g, '$1:')}\n  }`;
    
    src = src.substring(0, insertIdx) + mathSectionStr + src.substring(insertIdx);
    
    fs.writeFileSync('src/data/questions.ts', src, 'utf8');
    console.log("Successfully added Math section to Test 2!");
} else {
    console.log("Could not find insertion point for Test 2 Math section.");
}
