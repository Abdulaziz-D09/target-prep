const fs = require('fs');
const math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

// The robust regex for math blocks vs text blocks
const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/gs;

function fixLatex(text) {
    if (!text) return text;
    if (typeof text !== 'string') return text;
    
    // Fix known broken pairs
    text = text.replace(/\$ax \+ ky = \\\[\?\]is a line in the \$xy\$-plane/g, '$ax + ky = [?]$ is a line in the $xy$-plane');
    text = text.replace(/\\\[\?\]/g, '[?]'); // remove broken escape for [?]
    
    let parts = text.split(regex);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0 && parts[i]) { // Text parts (not matched by regex)
            // Replace standalone \frac{...}{...} with $\frac{...}{...}$
            parts[i] = parts[i].replace(/(\\frac\s*\{[^{}]*\}(?:\s*\{[^{}]*\})?)/g, '$$$1$$');
            parts[i] = parts[i].replace(/(\\sqrt\s*\{[^{}]*\})/g, '$$$1$$');
            parts[i] = parts[i].replace(/(\\pi\b)/g, '$$$1$$');
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
console.log('Fixed math_bank.json properly');
