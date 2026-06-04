import { practiceTests } from './src/data/questions';

practiceTests.forEach(pt => {
    console.log(pt.title);
    pt.sections.forEach(sec => {
        console.log("  " + sec.name);
        sec.modules.forEach((mod, i) => {
            console.log(`    Module ${i+1}: ${mod.questions.length} questions`);
        });
    });
});
