const fs = require('fs');

// 1. classroomStore.ts
let store = fs.readFileSync('src/store/classroomStore.ts', 'utf8');
store = store.replace(
  "  allowExit?: boolean;\n  createdAt: string;\n};",
  "  allowExit?: boolean;\n  strictToleranceSeconds?: number;\n  createdAt: string;\n};"
);
store = store.replace(
  "  joinCode: string;\n  createdAt: string;\n  status: 'upcoming' | 'active' | 'completed';",
  "  joinCode: string;\n  strictToleranceSeconds?: number;\n  createdAt: string;\n  status: 'upcoming' | 'active' | 'completed';"
);
fs.writeFileSync('src/store/classroomStore.ts', store);

// 2. LatexRenderer.tsx
let latex = fs.readFileSync('src/components/LatexRenderer.tsx', 'utf8');
latex = latex.replace(
  "className=\"flex justify-center mt-0 -mb-5\"",
  "className=\"flex justify-center my-3\""
);
fs.writeFileSync('src/components/LatexRenderer.tsx', latex);

// 3. teacher/assignments/page.tsx
let asgnPage = fs.readFileSync('src/app/teacher/assignments/page.tsx', 'utf8');
asgnPage = asgnPage.replace(
  "className=\"site-panel rounded-[24px] overflow-hidden\"",
  "className=\"site-panel rounded-[24px] overflow-y-auto max-h-[600px] min-h-[400px] flex flex-col justify-start\""
);
fs.writeFileSync('src/app/teacher/assignments/page.tsx', asgnPage);

// 4. teacher/mocks/page.tsx (if exists)
if (fs.existsSync('src/app/teacher/mocks/page.tsx')) {
  let mockPage = fs.readFileSync('src/app/teacher/mocks/page.tsx', 'utf8');
  mockPage = mockPage.replace(
    "className=\"site-panel rounded-[24px] overflow-hidden\"",
    "className=\"site-panel rounded-[24px] overflow-y-auto max-h-[600px] min-h-[400px] flex flex-col justify-start\""
  );
  fs.writeFileSync('src/app/teacher/mocks/page.tsx', mockPage);
}

// 5. dashboard/page.tsx (if student also has list)
if (fs.existsSync('src/app/dashboard/page.tsx')) {
  let dashboard = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
  dashboard = dashboard.replace(
    "className=\"site-panel rounded-[24px] overflow-hidden\"",
    "className=\"site-panel rounded-[24px] overflow-y-auto max-h-[600px] min-h-[400px] flex flex-col justify-start\""
  );
  fs.writeFileSync('src/app/dashboard/page.tsx', dashboard);
}
