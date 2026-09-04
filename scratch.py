import re

with open('src/components/MockTestFilesEditor.tsx', 'r') as f:
    content = f.read()

lookup = """    let expandedTestData: any = null;
    let expandedQuestionData: any = null;
    let expandedQuestionIdx = -1;

    if (expandedQuestionId) {
        for (const test of customTests) {
            if (!test.questions) continue;
            const qIdx = test.questions.findIndex((q: any) => `${test.id}-${q.id}` === expandedQuestionId);
            if (qIdx !== -1) {
                expandedTestData = test;
                expandedQuestionData = test.questions[qIdx];
                expandedQuestionIdx = qIdx;
                break;
            }
        }
    }

    if (customTests.length === 0) {"""

content = content.replace(
    "    if (customTests.length === 0) {",
    lookup
)

with open('src/components/MockTestFilesEditor.tsx', 'w') as f:
    f.write(content)

print("done")
