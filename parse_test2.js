const fs = require('fs');

const qsText = fs.readFileSync('test2_questions.txt', 'utf8');
const expText = fs.readFileSync('test2_explanations.txt', 'utf8');

const answers = { 1: {}, 2: {} };
const explanations = { 1: {}, 2: {} };
let currentModuleForExp = 1;
let currentQuestionForExp = null;
let currentExpLines = [];

expText.split('\n').forEach(line => {
    if (line.includes('MODULE 1')) currentModuleForExp = 1;
    else if (line.includes('MODULE 2')) currentModuleForExp = 2;
    
    const qMatch = line.match(/^## Question (\d+)/);
    if (qMatch) {
        if (currentQuestionForExp !== null) {
            explanations[currentModuleForExp][currentQuestionForExp] = currentExpLines.join('\n').trim();
        }
        currentQuestionForExp = parseInt(qMatch[1]);
        currentExpLines = [];
        
        // Extract answer: e.g. "Answer: **C (detected)**" or "Answer: C"
        const ansMatch = line.match(/Answer:\s*\*?\*?([A-D])/);
        if (ansMatch) {
            answers[currentModuleForExp][currentQuestionForExp] = ansMatch[1].charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        }
    } else if (currentQuestionForExp !== null && !line.startsWith('---') && !line.startsWith('End of')) {
        currentExpLines.push(line);
    }
});
if (currentQuestionForExp !== null) {
    explanations[currentModuleForExp][currentQuestionForExp] = currentExpLines.join('\n').trim();
}

const modules = [ { timeMinutes: 32, questions: [] }, { timeMinutes: 32, questions: [] } ];
const sections = qsText.split(/Section: Section 1, Module \d.*?\n/);
for (let m = 1; m <= 2; m++) {
    if (!sections[m]) continue;
    const blocks = sections[m].split(/\n(?=\d+\.)/);
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
            // Try another way if it failed
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
        
        let questionText = "Which choice completes the text with the most logical and precise word or phrase?";
        let passageText = promptText;
        const qMarkIdx = promptText.indexOf('?');
        if (qMarkIdx !== -1) {
            const qPatterns = [
                "Which choice",
                "Based on the text",
                "As used in the text",
                "What does the text",
                "Which statement",
                "Which finding",
                "Which quotation"
            ];
            for (let pat of qPatterns) {
                const idx = promptText.indexOf(pat);
                if (idx !== -1 && idx <= qMarkIdx) {
                    questionText = promptText.substring(idx, qMarkIdx + 1);
                    passageText = promptText.substring(0, idx) + promptText.substring(qMarkIdx + 1);
                    passageText = passageText.trim();
                    break;
                }
            }
        }
        
        modules[m-1].questions.push({
            id: `pt2-m${m}-q${qNum}`,
            type: "Reading",
            passage: passageText,
            question: questionText,
            options: finalOptions,
            answer: answers[m][qNum] !== undefined ? answers[m][qNum] : -1,
            explanation: explanations[m][qNum] || "",
            difficulty: m === 1 ? "Medium" : "Hard"
        });
    });
}

fs.writeFileSync('test2_parsed.json', JSON.stringify(modules, null, 2));
console.log("Parsing complete. Wrote " + modules[0].questions.length + " questions for Module 1, and " + modules[1].questions.length + " for Module 2.");
