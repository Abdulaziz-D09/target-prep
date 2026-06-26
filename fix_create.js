const fs = require('fs');

const files = [
  'src/app/teacher/assignments/create/page.tsx',
  'src/app/teacher/mocks/create/page.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Add state
  content = content.replace(
    "const [allowExit, setAllowExit]                   = useState(false);",
    "const [allowExit, setAllowExit]                   = useState(false);\n    const [strictToleranceSeconds, setStrictToleranceSeconds] = useState(5);"
  );

  // Add to object creation
  content = content.replace(
    "            allowExit,",
    "            allowExit,\n            strictToleranceSeconds,"
  );

  // Add UI block
  const uiTarget = `<p className="mt-1.5 text-[12px] site-text-muted">Prevents cheating by locking the student in full screen.</p>
                                    </div>`;
  const uiReplace = `<p className="mt-1.5 text-[12px] site-text-muted">Prevents cheating by locking the student in full screen.</p>
                                        {!allowExit && (
                                            <div className="mt-4">
                                                <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-2">Tolerance Timer (seconds)</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={strictToleranceSeconds || ''}
                                                    onChange={(e) => {
                                                        const raw = Number(e.target.value);
                                                        setStrictToleranceSeconds(Math.max(1, Math.round(raw)));
                                                    }}
                                                    className="w-full px-4 py-3 rounded-xl site-subpanel bg-transparent outline-none border-2 border-transparent focus:border-indigo-500 transition text-[15px] font-semibold site-text-strong"
                                                />
                                                <p className="mt-1 text-[12px] site-text-muted">Seconds given to return to fullscreen before auto-submitting.</p>
                                            </div>
                                        )}
                                    </div>`;
  content = content.replace(uiTarget, uiReplace);

  fs.writeFileSync(file, content);
}

// Fix usage in Assignment Page
let asgnPage = fs.readFileSync('src/app/classroom/assignment/[id]/page.tsx', 'utf8');
asgnPage = asgnPage.replace(
  "setWarningCountdown(5);",
  "setWarningCountdown(assignment.strictToleranceSeconds ?? 5);"
);
fs.writeFileSync('src/app/classroom/assignment/[id]/page.tsx', asgnPage);

// Fix usage in Mock Page
let testPage = fs.readFileSync('src/app/practice/test/[id]/page.tsx', 'utf8');
testPage = testPage.replace(
  "setFsWarningCountdown(5);",
  "setFsWarningCountdown(mockSession?.strictToleranceSeconds ?? 5);"
);
fs.writeFileSync('src/app/practice/test/[id]/page.tsx', testPage);

