const fs = require('fs');

const dataFile = 'src/data/questions.ts';
let code = fs.readFileSync(dataFile, 'utf8');

const parts = code.split('export const satDates = [');
if (parts.length < 2) {
    console.error("Could not find satDates");
    process.exit(1);
}

// Find the last occurrence of { name: 'Math', modules: [
const mathSectionIndex = parts[0].lastIndexOf(`{
                name: 'Math',
                modules: [`);

let newFirstPart = parts[0];
if (mathSectionIndex !== -1) {
    let sliceBeforeMath = parts[0].substring(0, mathSectionIndex);
    let lastCommaIdx = sliceBeforeMath.lastIndexOf(',');
    if (lastCommaIdx !== -1) {
        newFirstPart = sliceBeforeMath.substring(0, lastCommaIdx).trimRight() + '\n        ]\n    },';
    }
} else {
    newFirstPart = newFirstPart.replace(/\s*\]\s*;\s*$/, '\n    },');
}

let mathTestsStr = '';
for (let i = 6; i <= 10; i++) {
    mathTestsStr += `
    {
        id: ${i},
        title: 'Practice Test ${i}',
        description: 'Full Section 2',
        sections: [
            {
                name: 'Math',
                modules: [
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: \`m1-\${j + 1}\`,
                            type: 'Math',
                            question: \`[SM1Q\${j + 1}] This is a math question. Provide the correct answer based on the problem statement.\`,
                            options: ["10...", "15...", "20...", "25..."],
                            answer: 1,
                            explanation: "Sample math explanation.",
                            difficulty: "Medium",
                            calc: true
                        }))
                    },
                    {
                        timeMinutes: 35,
                        questions: Array.from({ length: 22 }).map((_, j) => ({
                            id: \`m2-\${j + 1}\`,
                            type: 'Math',
                            question: \`[SM2Q\${j + 1}] This is a math question. Provide the correct answer based on the problem statement.\`,
                            options: ["1...", "2...", "3...", "4..."],
                            answer: 2,
                            explanation: "Sample math explanation.",
                            difficulty: "Hard",
                            calc: true
                        }))
                    }
                ]
            }
        ]
    }${i !== 10 ? ',' : ''}`;
}

let finalCode = newFirstPart + '\n' + mathTestsStr + '\n];\n\nexport const satDates = [' + parts[1];
fs.writeFileSync(dataFile, finalCode);
console.log("Updated Math Tests!");
