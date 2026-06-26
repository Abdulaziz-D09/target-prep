const fs = require('fs');

let passage = fs.readFileSync('src/components/PassageRenderer.tsx', 'utf8');
passage = passage.replace(
  /text-\[#111827\] dark:text-slate-200/g,
  "text-[#111827]"
);
fs.writeFileSync('src/components/PassageRenderer.tsx', passage);
