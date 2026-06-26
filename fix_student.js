const fs = require('fs');

if (fs.existsSync('src/app/classroom/page.tsx')) {
  let clsPage = fs.readFileSync('src/app/classroom/page.tsx', 'utf8');
  clsPage = clsPage.replace(
    "className=\"site-panel rounded-[24px] overflow-hidden\"",
    "className=\"site-panel rounded-[24px] overflow-y-auto max-h-[600px] min-h-[400px] flex flex-col justify-start\""
  );
  fs.writeFileSync('src/app/classroom/page.tsx', clsPage);
}
