const fs = require('fs');
let code = fs.readFileSync('src/data/questions.ts', 'utf8');

const startIndex = code.indexOf('const pt1_mathModule1');
const endIndex = code.indexOf('const pt2_englishModule1');

if (startIndex !== -1 && endIndex !== -1) {
  let section = code.substring(startIndex, endIndex);
  
  section = section.replace(/\$/g, '');
  
  section = section.replace(/44\.00/g, '$44.00');
  section = section.replace(/51\.50/g, '$51.50');
  section = section.replace(/66\.50/g, '$66.50');

  code = code.substring(0, startIndex) + section + code.substring(endIndex);
  fs.writeFileSync('src/data/questions.ts', code);
  console.log('Fixed dollars in pt1 math modules!');
} else {
  console.log('Could not find bounds');
}
