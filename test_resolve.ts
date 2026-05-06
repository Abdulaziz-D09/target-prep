import { practiceTests } from './src/data/questions';
import { resolvePracticeTest } from './src/lib/practiceCatalog';

const test = resolvePracticeTest(1);
if (test) {
    console.log("Test 1 sections:", test.sections.map(s => s.name));
    console.log("Module counts:", test.sections.map(s => s.modules.length));
    console.log("Question counts:", test.sections.map(s => s.modules.map(m => m.questions.length)));
}
