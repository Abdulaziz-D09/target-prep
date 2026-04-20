const fs = require('fs');
const path = require('path');

const samplePassage1 = 'The explorer stood at the edge of the cliff, gazing at the vast expanse below. The wind howled, carrying whispers of ancient stories that had been told for generations among the mountain people.';
const samplePassage2 = 'The architectural firm decided to implement a green roof on their latest skyscraper design. This would not only reduce the heat island effect but also provide a small habitat for local birds and insects in the middle of the densely populated urban center.';

const generateModules = () => {
    const mod1 = [];
    const mod2 = [];
    for (let i = 1; i <= 27; i++) {
        mod1.push({
            id: 'e1-' + i,
            type: 'Reading',
            passage: '[EM1Q' + i + '] ' + samplePassage1,
            question: 'As used in the text, the word "whispers" most nearly means:',
            options: ['Quiet sounds', 'Subtle suggestions', 'Warnings', 'Faint traces'],
            answer: 1,
            explanation: 'In context, "whispers" metaphorically refers to subtle suggestions or hints.',
            difficulty: 'Medium'
        });
        mod2.push({
            id: 'e2-' + i,
            type: 'Reading',
            passage: '[EM2Q' + i + '] ' + samplePassage2,
            question: 'The primary purpose of the green roof is to:',
            options: ['Reduce building costs', 'Provide a habitat and reduce heat', 'Impress the city council', 'Block out city noise'],
            answer: 1,
            explanation: 'The passage mentions reducing the heat island effect and providing a habitat.',
            difficulty: 'Easy'
        });
    }
    return { mod1, mod2 };
};

const { mod1, mod2 } = generateModules();

const tests = [];
for (let i = 1; i <= 5; i++) {
    tests.push({
        id: i,
        title: 'Practice Test ' + i,
        description: 'Full English SAT test',
        type: 'Full Section 1',
        duration: '1h 4m',
        totalQuestions: 54,
        moduleCount: 2,
        color: i % 2 === 0 ? 'purple' : 'blue',
        sections: [
            {
                name: 'Reading and Writing',
                modules: [
                    { questions: mod1, timeMinutes: 32 },
                    { questions: mod2, timeMinutes: 32 }
                ]
            }
        ]
    });
}

const content = [
    "export interface Question {",
    "    id: string;",
    "    type: 'Reading' | 'Grammar' | 'Math';",
    "    passage?: string;",
    "    question: string;",
    "    options: string[];",
    "    answer: number;",
    "    explanation: string;",
    "    difficulty: 'Easy' | 'Medium' | 'Hard';",
    "    calc?: boolean;",
    "}",
    "",
    "export interface TestModule {",
    "    questions: Question[];",
    "    timeMinutes: number;",
    "}",
    "",
    "export interface TestSection {",
    "    name: string;",
    "    modules: TestModule[];",
    "}",
    "",
    "export interface PracticeTest {",
    "    id: number;",
    "    title: string;",
    "    description: string;",
    "    type: string;",
    "    duration: string;",
    "    totalQuestions: number;",
    "    moduleCount: number;",
    "    color: string;",
    "    sections: TestSection[];",
    "}",
    "",
    "const englishModule1: Question[] = " + JSON.stringify(mod1, null, 4) + ";",
    "",
    "const englishModule2: Question[] = " + JSON.stringify(mod2, null, 4) + ";",
    "",
    "export const practiceTests: PracticeTest[] = " + JSON.stringify(tests, null, 4) + ";",
    "",
    "export const satDates = [",
    "    { month: 'MAR', date: 'March 14, 2026', deadline: 'Registration Deadline: Feb 27, 2026', target: '2026-03-14T08:00:00' },",
    "    { month: 'MAY', date: 'May 2, 2026', deadline: 'Registration Deadline: Apr 17, 2026', target: '2026-05-02T08:00:00' },",
    "    { month: 'JUN', date: 'June 7, 2026', deadline: 'Registration Deadline: May 9, 2026', target: '2026-06-07T08:00:00' },",
    "    { month: 'AUG', date: 'August 22, 2026', deadline: 'Registration Deadline: Jul 25, 2026', target: '2026-08-22T08:00:00' },",
    "];",
    "",
    "export const studyResources = [",
    "    { id: 1, title: 'Grammar Rules Guide', description: 'Comprehensive guide to SAT grammar and punctuation rules.', category: 'English', icon: 'book-open', color: 'purple' },",
    "    { id: 2, title: 'Reading Strategies', description: 'Techniques for active reading and passage analysis.', category: 'English', icon: 'eye', color: 'emerald' },",
    "    { id: 3, title: 'SAT Vocabulary 500', description: 'Most frequently tested vocabulary words with examples.', category: 'English', icon: 'file-text', color: 'rose' },",
    "];"
].join('\\n');

fs.writeFileSync(path.join(__dirname, 'src/data/questions.ts'), content);
console.log('Done rewriting questions.ts');
