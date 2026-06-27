const fs = require('fs');
let code = fs.readFileSync('src/app/teacher/mocks/create/page.tsx', 'utf8');

// I will just use regex to replace everything from <label className="block text-sm font-bold site-text-strong mb-3">Add Questions</label> to {customTests.length > 1 && (
// Let's replace the whole block manually
const targetStart = '<label className="block text-sm font-bold site-text-strong mb-3">Add Questions</label>';
const targetEnd = '{customTests.length > 1 && (';

const startIndex = code.indexOf(targetStart);
const endIndex = code.indexOf(targetEnd);

const newBlock = \`
                                <label className="block text-sm font-bold site-text-strong mb-3">Add Questions</label>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Upload Area */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={\\\`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all \${isDragging
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
                                            }\\\`}
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

                                    {/* Create Manually Area */}
                                    <div 
                                        onClick={() => {
                                            const newTest = {
                                                id: \\\`manual-test-\${Date.now()}\\\`,
                                                name: \\\`Manual Test \${customTests.length + 1}\\\`,
                                                questions: [{
                                                    id: \\\`mock-q-\${Date.now()}-0\\\`,
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
                                )}

                                \`;

code = code.substring(0, startIndex) + newBlock + code.substring(endIndex);

fs.writeFileSync('src/app/teacher/mocks/create/page.tsx', code);
