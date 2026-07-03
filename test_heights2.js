const fs = require('fs');
const math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

let counts = { block: 0, inline: 0 };
math.forEach(q => {
  if (q.options) {
    q.options.forEach(o => {
      if (o.includes('$$')) counts.block++;
      else if (o.includes('$')) counts.inline++;
    });
  }
});
console.log(counts);
