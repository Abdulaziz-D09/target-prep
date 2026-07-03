const fs = require('fs');
const math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

let c = 0;
math.forEach(q => {
  const fullText = (q.question || '') + ' ' + (q.options ? q.options.join(' ') : '') + ' ' + (q.explanation || '');
  if (fullText.includes('\\frac') || fullText.includes('\\sqrt')) {
    const withoutMath = fullText.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[\s\S]*?\$/g, '');
    if (withoutMath.includes('\\frac') || withoutMath.includes('\\sqrt')) {
        c++;
        if (c <= 3) console.log('Problem:', fullText);
    }
  }
});
console.log('Count:', c);
