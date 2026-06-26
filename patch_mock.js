const fs = require('fs');

const path = 'src/app/teacher/mocks/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('import { QuestionEditor }')) {
    content = content.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { QuestionEditor } from '@/components/QuestionEditor';\nimport { practiceTests, Question } from '@/data/questions';\n");
}

if (!content.includes('const [activeTab')) {
    content = content.replace("const [studentToRemove, setStudentToRemove] = useState<{ id: string, name: string } | null>(null);", "const [studentToRemove, setStudentToRemove] = useState<{ id: string, name: string } | null>(null);\n    const [activeTab, setActiveTab] = useState<'progress' | 'questions'>('progress');");
}

if (!content.includes('const mockQuestions = ')) {
    content = content.replace("const session = mockSessions.find", `
    // Calculate custom questions
    const mockQuestions: Question[] = [];
    const sessionToUse = mockSessions.find(s => s.id === mockId);
    if (sessionToUse) {
        sessionToUse.attachedTestIds.forEach(testId => {
            const test = practiceTests.find(pt => pt.id === testId);
            if (test) {
                test.modules.forEach(m => {
                    m.questions.forEach(q => {
                        // Override with custom question if exists
                        const customQ = sessionToUse.customQuestions?.[q.id];
                        mockQuestions.push(customQ || q);
                    });
                });
            }
        });
    }

    const session = mockSessions.find`);
}

const tabUI = `
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2 mt-6">
                    <button 
                        onClick={() => setActiveTab('progress')}
                        className={\`px-4 py-2 font-bold text-sm transition-colors border-b-2 \${activeTab === 'progress' ? 'border-indigo-600 text-indigo-600' : 'border-transparent site-text-muted hover:site-text-strong'}\`}
                    >
                        Student Progress
                    </button>
                    <button 
                        onClick={() => setActiveTab('questions')}
                        className={\`px-4 py-2 font-bold text-sm transition-colors border-b-2 \${activeTab === 'questions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent site-text-muted hover:site-text-strong'}\`}
                    >
                        View & Edit Questions
                    </button>
                </div>
`;

if (!content.includes('{/* Tabs */}')) {
    content = content.replace('{/* Content grid */}', tabUI + "\n                {activeTab === 'progress' ? (\n                <>\n                {/* Content grid */}");
    content = content.replace('{/* End of content grid */}\n            </div>', '{/* End of content grid */}\n                </>\n                ) : (\n                    <QuestionEditor questions={mockQuestions} onSave={(qId, newQ) => useClassroomStore.getState().updateMockQuestion(session.id, "none", qId, newQ)} />\n                )}\n            </div>');
}

fs.writeFileSync(path, content);
console.log("Patched mocks page!");
