const fs = require('fs');
let code = fs.readFileSync('src/app/teacher/mocks/create/page.tsx', 'utf8');

code = code.replace(
    "import { LatexRenderer } from '@/components/LatexRenderer';\nimport { PassageRenderer } from '@/components/PassageRenderer';",
    "import { MockTestFilesEditor } from '@/components/MockTestFilesEditor';"
);

code = code.replace(
    "const [scanError, setScanError] = useState('');\n    const [reviewingTest, setReviewingTest] = useState<{ file: File, questions: any[] } | null>(null);",
    "const [scanError, setScanError] = useState('');"
);

code = code.replace(
    "setReviewingTest({ file, questions: qs });",
    "setCustomTests(prev => [...prev, { file, id: `mock-test-${Date.now()}`, name: file.name, questions: qs }]);"
);

// remove handleImageUpload completely
code = code.replace(/const handleImageUpload = async \([\s\S]*?if \(e\.target\) e\.target\.value = '';\n        }\n    };\n/m, '');

const oldUploadArea = `{customTests.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {customTests.map((t, idx) => (
                                            <div key={t.id} className="flex items-center justify-between p-3 border-2 border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold site-text-strong text-[14px]">{t.name}</p>
                                                        <p className="text-[12px] site-text-muted mt-0.5">{t.questions.length} questions parsed</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCustomTests(prev => prev.filter(test => test.id !== t.id));
                                                    }}
                                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition text-rose-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}`;

const newUploadAndCreateArea = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={\`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all \${isDragging
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
                                        }\`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) { scanFile(f); }
                                        }}
                                    />
                                    {isScanning ? (
                                        <>
                                            <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                                                <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
                                            </div>
                                            <p className="font-bold site-text-strong text-[15px]">Scanning document...</p>
                                            <p className="text-[13px] site-text-muted mt-1">Extracting mock test questions</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                <Upload className="h-7 w-7 site-text-muted" />
                                            </div>
                                            <p className="font-bold site-text-strong text-[15px]">Upload or drop your test files here</p>
                                            <p className="text-[13px] site-text-muted mt-1 mb-2 text-center">Upload picture of a test or PDF to extract questions (Max 20MB per file)</p>
                                        </>
                                    )}
                                </div>
                                <div 
                                    onClick={() => {
                                        const newTest = {
                                            id: \`manual-test-\${Date.now()}\`,
                                            name: \`Manual Test \${customTests.length + 1}\`,
                                            questions: [{
                                                id: \`mock-q-\${Date.now()}-0\`,
                                                passage: '',
                                                question: '',
                                                options: ['', '', '', ''],
                                                answer: null
                                            }]
                                        };
                                        setCustomTests(prev => [...prev, newTest]);
                                    }}
                                    className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all border-slate-300 dark:border-slate-700 hover:border-blue-400"
                                >
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                        <FileText className="h-7 w-7 site-text-muted" />
                                    </div>
                                    <p className="font-bold site-text-strong text-[15px]">Create Manually</p>
                                    <p className="text-[13px] site-text-muted mt-1 mb-2 text-center">Write questions without uploading</p>
                                </div>
                                </div>

                                {customTests.length > 0 && (
                                    <div className="mt-6">
                                        <MockTestFilesEditor 
                                            initialTests={customTests}
                                            onSave={() => {}}
                                            onChange={(updatedTests) => setCustomTests(updatedTests)}
                                            hideSaveButton={true}
                                        />
                                    </div>
                                )}`;

// Remove old upload div
code = code.replace(/<div\s+onDragOver=\{\(e\) => \{[\s\S]*?<\/div>/, newUploadAndCreateArea);

code = code.replace(oldUploadArea, '');

// Remove ReviewModal logic at the end
code = code.replace(/\{\/\* Answer Key Review Modal \*\/\}[\s\S]*<\/AnimatePresence>/, '');

fs.writeFileSync('src/app/teacher/mocks/create/page.tsx', code);
