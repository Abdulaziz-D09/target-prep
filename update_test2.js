const fs = require('fs');
const parsed = JSON.parse(fs.readFileSync('test2_parsed.json', 'utf8'));

const questionsFile = 'src/data/questions.ts';
let code = fs.readFileSync(questionsFile, 'utf8');

// The tests are in an array: export const practiceTests: PracticeTest[] = [ { id: 1, ... }, { id: 2, ... } ];
// I need to replace the `sections` array of `id: 2`.
// Instead of doing complex string manipulation, I will use regex or find the exact start and end of Practice Test 2's Reading and Writing section.

const p2Start = code.indexOf('id: 2,\n    title: "Practice Test 2",');
const p3Start = code.indexOf('id: 3,\n    title: "Practice Test 3",');

if (p2Start === -1) {
    console.log("Could not find Practice Test 2");
    process.exit(1);
}

// Find Math section start
const mathStart = code.indexOf('name: "Math"', p2Start);

if (mathStart === -1 || mathStart > (p3Start !== -1 ? p3Start : code.length)) {
    console.log("Could not find Math section in Practice Test 2");
    process.exit(1);
}

// Construct new Reading and Writing section
// Module 1 is parsed[0], Module 2 Hard is parsed[1]
// We will duplicate parsed[1] for Module 2 Easy for now.
const readingSectionStr = `  {
    name: "Reading and Writing",
    modules: [
    {
      timeMinutes: 32,
      questions: ${JSON.stringify(parsed[0].questions, null, 8).replace(/\\n/g, "\\n")}
    },
    {
      timeMinutes: 32,
      questions: ${JSON.stringify(parsed[1].questions, null, 8).replace(/\\n/g, "\\n")}
    },
    {
      timeMinutes: 32,
      questions: ${JSON.stringify(parsed[1].questions, null, 8).replace(/\\n/g, "\\n")}
    }
    ]
  },
  {
    `; // Connect to name: "Math"

const beforeP2Reading = code.substring(0, code.indexOf('sections: [', p2Start) + 'sections: [\n'.length);
const afterP2Reading = code.substring(mathStart - '  {\n    '.length);

const newCode = beforeP2Reading + readingSectionStr + afterP2Reading.substring(4); // clean up connection
fs.writeFileSync(questionsFile, newCode);
console.log("Updated questions.ts with Practice Test 2 Reading and Writing sections.");
