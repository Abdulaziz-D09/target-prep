const fs = require('fs');
let math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

// Only do this for answer options. We leave the question stem block maths alone.
math.forEach(q => {
    if (q.options) {
        q.options = q.options.map(opt => {
            // Replace block math $$ with inline math $ everywhere in options
            return opt.replace(/\$\$/g, '$');
        });
    }
});

fs.writeFileSync('src/data/math_bank.json', JSON.stringify(math, null, 2), 'utf8');
