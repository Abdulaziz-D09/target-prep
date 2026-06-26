const fs = require('fs');
const file = 'src/app/classroom/page.tsx';

let content = fs.readFileSync(file, 'utf8');
content = content.replace(
    `<div className="space-y-3">\n                        {visibleAssignments.length === 0 ? (`,
    `<div className="space-y-3 min-h-[500px]">\n                        {visibleAssignments.length === 0 ? (`
);

fs.writeFileSync(file, content);
