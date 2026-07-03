const fs = require('fs');

let math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

// 1. Remove all questions with [?]
const initialCount = math.length;
math = math.filter(q => {
    const qStr = JSON.stringify(q);
    return !qStr.includes('[?]');
});
console.log(`Removed ${initialCount - math.length} questions containing [?]`);

// 2. Wrap standalone variables in $ $
// The robust regex for math blocks vs text blocks
const regex = /(\$\$.*?\$\$|(?<!\\)\$(?!\s)(?:[^\$]*?[^\s\\])?\$(?!\\))/gs;

// Only wrap if it's truly a variable.
// Words to avoid: "a", "I". "A" can be option A.
// Variables: x, y, z, k, h, m, n, p, q, r, s, t, u, v, w, b, c, d, f, g.
// To be safe, we wrap any single letter EXCEPT a, A, i, I, O
// We only wrap it if it's not immediately next to a letter.
// Example: (x, y) -> ($x$, $y$)
// What is the value of x? -> What is the value of $x$?
function wrapVariables(text) {
    if (!text) return text;
    if (typeof text !== 'string') return text;
    
    let parts = text.split(regex);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0 && parts[i]) { // Text parts
            // We want to match \b([b-hj-np-zB-HJ-NP-Z])\b
            // But wait! "x" in "2x" is NOT a word boundary!
            // In "2x", \b doesn't match between 2 and x!
            // Wait, in "2x", we should wrap the whole "2x" or just "x"?
            // We probably want to leave "2x" if it's not wrapped?
            // Actually, my previous script converted "1/2 y" to "$\frac{1}{2}$ $y$".
            
            // Let's use a very aggressive regex for single variables.
            // Lookbehind: not a letter. Lookahead: not a letter.
            // Allowed characters: spaces, punctuation.
            parts[i] = parts[i].replace(/(^|[^a-zA-Z0-9])([xXyYzZkKmMhHnNpPqQrRsStTuUvVwWbBcCdDfFgG])(?=[^a-zA-Z0-9]|$)/g, '$1$$$2$$');
            
            // Fix double $$ ($$x$$ -> $x$)
            parts[i] = parts[i].replace(/\$\$\$(\w)\$\$\$/g, '$$$1$$');
            parts[i] = parts[i].replace(/\$\$(\w)\$\$/g, '$$$1$$');
        }
    }
    return parts.join('');
}

math.forEach(q => {
    q.question = wrapVariables(q.question);
    if (q.options) {
        q.options = q.options.map(o => wrapVariables(o));
    }
    q.explanation = wrapVariables(q.explanation);
});

// Since we did this aggressively, let's fix any $$ x $$ into $x$ if it caused issues, 
// but wait, `$$x$$` means block math. `$$x$$` inside `$$x$$`?
// Our regex does `$1$$$2$$`. If it was ` $x$ `, the `$ ` is not a letter, so it becomes `$ $$x$$ $`.
// Oh! We shouldn't wrap if it's already inside $ $!
// But `regex` splits out the $ $ blocks, so we are ONLY applying it to the plain text parts!
// However, there could be broken `$ $` from previous scripts.
// Let's just run it and see!
fs.writeFileSync('src/data/math_bank.json', JSON.stringify(math, null, 2), 'utf8');
