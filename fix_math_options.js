const fs = require('fs');
let math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

// Only do this for answer options. We leave the question stem block maths alone.
math.forEach(q => {
    if (q.options) {
        q.options = q.options.map(opt => {
            // Replace block math $$ with inline math $
            let newOpt = opt.trim();
            if (newOpt.startsWith('$$') && newOpt.endsWith('$$')) {
                // Check if it's the ONLY thing in the string (most common for math options)
                newOpt = '$' + newOpt.slice(2, -2).trim() + '$';
            } else {
                // If there are inline $$ tags inside text
                newOpt = newOpt.replace(/\$\$(.*?)\$\$/g, '$$$1$$');
            }
            return newOpt;
        });
    }
});

fs.writeFileSync('src/data/math_bank.json', JSON.stringify(math, null, 2), 'utf8');
