const fs = require('fs');
const math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

// The robust regex for math blocks vs text blocks
const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/gs;

function fixLatex(text) {
    if (!text) return text;
    if (typeof text !== 'string') return text;
    
    // In my previous script I replaced cases with aligned, but array{l} is much better for left aligning equations
    text = text.replace(/\\begin\{aligned\}/g, '\\begin{array}{l}');
    text = text.replace(/\\end\{aligned\}/g, '\\end{array}');
    
    return text;
}

math.forEach(q => {
    q.question = fixLatex(q.question);
    if (q.options) {
        q.options = q.options.map(o => fixLatex(o));
    }
    q.explanation = fixLatex(q.explanation);
});

fs.writeFileSync('src/data/math_bank.json', JSON.stringify(math, null, 2), 'utf8');
console.log('Fixed math_bank.json array{l}');
