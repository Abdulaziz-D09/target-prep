const fs = require('fs');
const math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

// The robust regex for math blocks vs text blocks
const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/gs;

function fixLatex(text) {
    if (!text) return text;
    if (typeof text !== 'string') return text;
    
    // Replace cases with aligned
    text = text.replace(/\\begin\{cases\}/g, '\\begin{aligned}');
    text = text.replace(/\\end\{cases\}/g, '\\end{aligned}');
    
    let parts = text.split(regex);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0 && parts[i]) { // Text parts (not matched by regex)
            // Replace 1/2 y = 4 -> $\frac{1}{2}y = 4$
            // Actually, just wrap expressions like 1/2 y = 4 in $ $
            // Let's replace standalone variables like x and y, and simple equations
            // We can wrap simple isolated letters: x, y, k, t, p, q, r, s, h, a, b, c, m, n
            parts[i] = parts[i].replace(/\b([xyktpqrshabcmn])\b(?=\s*(=|\+|-|<|>|\/|and|or|,|\.))/g, '$$$1$$');
            
            // Fix "1/2 y" -> "\frac{1}{2} y" inside text
            parts[i] = parts[i].replace(/\b(\d+)\/(\d+)\b/g, '$\\frac{$1}{$2}$');
            
            // Wait, if it becomes $\frac{1}{2}$ it might create lots of $$
            // That's fine.
        } else if (parts[i]) {
            // inside math blocks, if there's \begin{cases}, we already replaced it
        }
    }
    return parts.join('');
}

math.forEach(q => {
    q.question = fixLatex(q.question);
    if (q.options) {
        q.options = q.options.map(o => fixLatex(o));
    }
    q.explanation = fixLatex(q.explanation);
});

fs.writeFileSync('src/data/math_bank.json', JSON.stringify(math, null, 2), 'utf8');
console.log('Fixed math_bank.json content heuristics');
