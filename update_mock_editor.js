const fs = require('fs');
let code = fs.readFileSync('src/components/MockTestFilesEditor.tsx', 'utf8');

// Add onChange and hideSaveButton props
code = code.replace(
    'export function MockTestFilesEditor({ initialTests, onSave }: { initialTests: any[], onSave: (tests: any[]) => void }) {',
    'export function MockTestFilesEditor({ initialTests, onSave, onChange, hideSaveButton }: { initialTests: any[], onSave: (tests: any[]) => void, onChange?: (tests: any[]) => void, hideSaveButton?: boolean }) {'
);

// Call onChange whenever customTests changes
code = code.replace(
    '    const deleteTest = (testId: string) => {\n        setCustomTests(prev => prev.filter(test => test.id !== testId));\n    };',
    '    const deleteTest = (testId: string) => {\n        setCustomTests(prev => prev.filter(test => test.id !== testId));\n    };\n\n    useEffect(() => {\n        if (onChange) onChange(customTests);\n    }, [customTests, onChange]);'
);

// Hide save button
code = code.replace(
    '<button onClick={() => onSave(customTests)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2">\n                    <Save className="w-4 h-4" /> Save Changes\n                </button>',
    '{!hideSaveButton && <button onClick={() => onSave(customTests)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2">\n                    <Save className="w-4 h-4" /> Save Changes\n                </button>}'
);

fs.writeFileSync('src/components/MockTestFilesEditor.tsx', code);
