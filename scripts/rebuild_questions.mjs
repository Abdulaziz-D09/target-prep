/**
 * rebuild_questions.mjs
 * Rebuilds practiceTests in questions.ts using real questions from math_bank.json and ebrw_bank.json.
 * Run: node scripts/rebuild_questions.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const mathBank = JSON.parse(readFileSync(join(root, 'src/data/math_bank.json'), 'utf-8'));
const ebrwBank = JSON.parse(readFileSync(join(root, 'src/data/ebrw_bank.json'), 'utf-8'));

// Filter to only multiple-choice questions (options must have 4 entries)
const mathMC = mathBank.filter(q => Array.isArray(q.options) && q.options.length === 4);
const ebrwMC = ebrwBank.filter(q => Array.isArray(q.options) && q.options.length === 4);

console.log(`Available Math MC: ${mathMC.length}`);
console.log(`Available EBRW MC: ${ebrwMC.length}`);

// SAT structure per test:
// Reading & Writing: Module1 (27q, 32min) + Module2 (27q, 32min) = 54
// Math:              Module1 (22q, 35min) + Module2 (22q, 35min) = 44
// Total: 98 questions, 2h 14min
// We'll build 5 full tests
const NUM_TESTS = 5;
const EBRW_M1_COUNT = 27;
const EBRW_M2_COUNT = 27;
const MATH_M1_COUNT = 22;
const MATH_M2_COUNT = 22;

// Slice questions into non-overlapping blocks for each test
function sliceQuestions(bank, count, testIdx, moduleIdx, qPerTest, modulesPerTest) {
  const offset = testIdx * qPerTest * modulesPerTest + moduleIdx * qPerTest;
  return bank.slice(offset, offset + count);
}

function buildModule(questions, prefix, timeMinutes, ismath) {
  return {
    timeMinutes,
    questions: questions.map((q, i) => ({
      id: q.id || `${prefix}-${i}`,
      type: q.type || (ismath ? 'Math' : 'Reading'),
      passage: q.passage || undefined,
      image: q.image || undefined,
      question: q.question,
      options: q.options,
      answer: typeof q.answer === 'number' ? q.answer : 0,
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'Medium',
      calc: ismath ? true : undefined,
    }))
  };
}

// Build 5 full practice tests
const tests = [];

for (let t = 0; t < NUM_TESTS; t++) {
  // English modules (non-overlapping across tests)
  const ebrwM1Offset = t * (EBRW_M1_COUNT + EBRW_M2_COUNT);
  const ebrwM2Offset = ebrwM1Offset + EBRW_M1_COUNT;
  const ebrwM1 = ebrwMC.slice(ebrwM1Offset, ebrwM1Offset + EBRW_M1_COUNT);
  const ebrwM2 = ebrwMC.slice(ebrwM2Offset, ebrwM2Offset + EBRW_M2_COUNT);

  // Math modules (non-overlapping across tests)
  const mathM1Offset = t * (MATH_M1_COUNT + MATH_M2_COUNT);
  const mathM2Offset = mathM1Offset + MATH_M1_COUNT;
  const mathM1 = mathMC.slice(mathM1Offset, mathM1Offset + MATH_M1_COUNT);
  const mathM2 = mathMC.slice(mathM2Offset, mathM2Offset + MATH_M2_COUNT);

  if (ebrwM1.length < EBRW_M1_COUNT || ebrwM2.length < EBRW_M2_COUNT) {
    console.warn(`Warning: Not enough EBRW questions for test ${t+1}`);
  }
  if (mathM1.length < MATH_M1_COUNT || mathM2.length < MATH_M2_COUNT) {
    console.warn(`Warning: Not enough Math questions for test ${t+1}`);
  }

  tests.push({
    id: t + 1,
    title: `Practice Test ${t + 1}`,
    description: 'Full-length Digital SAT practice test with Reading, Writing, and Math sections.',
    type: 'Full Test',
    duration: '2h 14m',
    totalQuestions: EBRW_M1_COUNT + EBRW_M2_COUNT + MATH_M1_COUNT + MATH_M2_COUNT,
    moduleCount: 4,
    color: 'blue',
    sections: [
      {
        name: 'Reading and Writing',
        modules: [
          buildModule(ebrwM1, `t${t+1}-e-m1`, 32, false),
          buildModule(ebrwM2, `t${t+1}-e-m2`, 32, false),
        ]
      },
      {
        name: 'Math',
        modules: [
          buildModule(mathM1, `t${t+1}-m-m1`, 35, true),
          buildModule(mathM2, `t${t+1}-m-m2`, 35, true),
        ]
      }
    ]
  });
}

console.log('Built tests:', tests.length);
tests.forEach((t, i) => {
  const rw = t.sections[0];
  const math = t.sections[1];
  console.log(`Test ${i+1}: RW M1=${rw.modules[0].questions.length} M2=${rw.modules[1].questions.length} | Math M1=${math.modules[0].questions.length} M2=${math.modules[1].questions.length}`);
});

// Now read the existing questions.ts file and replace the practiceTests block
const questionsPath = join(root, 'src/data/questions.ts');
const existing = readFileSync(questionsPath, 'utf-8');

// Find where practiceTests starts and where satDates starts  
const startMarker = 'export const practiceTests: PracticeTest[] = [';
const endMarker = 'export const satDates';

const startIdx = existing.indexOf(startMarker);
const endIdx = existing.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find practiceTests or satDates markers in questions.ts');
  process.exit(1);
}

// Build the new practiceTests block
function serializeQuestion(q) {
  const lines = [];
  lines.push('{');
  lines.push(`  id: ${JSON.stringify(q.id)},`);
  lines.push(`  type: ${JSON.stringify(q.type)},`);
  if (q.passage) lines.push(`  passage: ${JSON.stringify(q.passage)},`);
  if (q.image) lines.push(`  image: ${JSON.stringify(q.image)},`);
  lines.push(`  question: ${JSON.stringify(q.question)},`);
  lines.push(`  options: ${JSON.stringify(q.options)},`);
  lines.push(`  answer: ${q.answer},`);
  lines.push(`  explanation: ${JSON.stringify(q.explanation)},`);
  lines.push(`  difficulty: ${JSON.stringify(q.difficulty)},`);
  if (q.calc) lines.push(`  calc: true,`);
  lines.push('}');
  return lines.join('\n        ');
}

function serializeModule(mod) {
  const qStrs = mod.questions.map(q => '      ' + serializeQuestion(q)).join(',\n');
  return `    {
      timeMinutes: ${mod.timeMinutes},
      questions: [
${qStrs}
      ]
    }`;
}

function serializeSection(sec) {
  const modStrs = sec.modules.map(m => serializeModule(m)).join(',\n');
  return `  {
    name: ${JSON.stringify(sec.name)},
    modules: [
${modStrs}
    ]
  }`;
}

function serializeTest(test) {
  const secStrs = test.sections.map(s => serializeSection(s)).join(',\n');
  return `  {
    id: ${test.id},
    title: ${JSON.stringify(test.title)},
    description: ${JSON.stringify(test.description)},
    type: ${JSON.stringify(test.type)},
    duration: ${JSON.stringify(test.duration)},
    totalQuestions: ${test.totalQuestions},
    moduleCount: ${test.moduleCount},
    color: ${JSON.stringify(test.color)},
    sections: [
${secStrs}
    ]
  }`;
}

const newPracticeTestsBlock = `export const practiceTests: PracticeTest[] = [
${tests.map(t => serializeTest(t)).join(',\n')}
];\n\n`;

const before = existing.slice(0, startIdx);
const after = existing.slice(endIdx);
const newContent = before + newPracticeTestsBlock + after;

writeFileSync(questionsPath, newContent, 'utf-8');
console.log('Done! questions.ts updated successfully.');
console.log('New file size:', (newContent.length / 1024).toFixed(1), 'KB');
