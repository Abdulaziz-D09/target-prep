const fs = require('fs');
const content = fs.readFileSync('src/components/PassageRenderer.tsx', 'utf8');

const parsePassageBlock = content.match(/function parsePassage[\s\S]*?return segs;\n}/);
console.log(parsePassageBlock[0]);
