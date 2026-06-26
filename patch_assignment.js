const fs = require('fs');

const path = 'src/app/teacher/assignments/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add QuestionEditor import (we will create this component)
if (!content.includes('import QuestionEditor')) {
    content = content.replace("import { FloatingPageShapes }", "import { FloatingPageShapes } from '@/components/SiteMotion';\nimport { QuestionEditor } from '@/components/QuestionEditor';\n");
}

// Add state for active tab
if (!content.includes('const [activeTab')) {
    content = content.replace("const [selectedClassId, setSelectedClassId] = useState<string | null>(null);", "const [selectedClassId, setSelectedClassId] = useState<string | null>(null);\n    const [activeTab, setActiveTab] = useState<'progress' | 'questions'>('progress');");
}

// Add tab toggle UI before class filters
const tabToggle = `
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
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
    content = content.replace("{/* Class filter pills */}", tabToggle + "\n                {activeTab === 'progress' ? (\n                <>\n                {/* Class filter pills */}");
    content = content.replace("</div>\n        </div>\n    );\n}", "                </>\n                ) : (\n                    <QuestionEditor questions={asgn.questions} onSave={(qId, newQ) => useClassroomStore.getState().updateAssignmentQuestion(asgn.id, qId, newQ)} />\n                )}\n            </div>\n        </div>\n    );\n}");
}

fs.writeFileSync(path, content);
console.log("Patched assignment page!");
