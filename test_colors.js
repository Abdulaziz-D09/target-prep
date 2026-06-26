const fs = require('fs');

const passage = fs.readFileSync('src/components/PassageRenderer.tsx', 'utf8');
const testColors = passage.match(/text-\[#111827\] dark:text-slate-200/g);
console.log('Colors in PassageRenderer:', testColors);

