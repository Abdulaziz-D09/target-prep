const fs = require('fs');
const math = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));

// Function to safely wrap unprotected LaTeX commands with $
function fixLatex(text) {
    if (!text) return text;
    if (typeof text !== 'string') return text;
    
    // First, let's fix known broken pairs like $ax + ky = \[?]is a line in the $xy$-plane
    // Actually, \[?] is a placeholder for a blank! 
    // The original text was probably $ax + ky = [?]$ is a line in the $xy$-plane
    text = text.replace(/\$ax \+ ky = \\\[\?\]is a line in the \$xy\$-plane/g, '$ax + ky = [?]$ is a line in the $xy$-plane');
    text = text.replace(/\\\[\?\]/g, '[?]'); // remove broken escape for [?]
    
    // We want to find commands like \frac{...}{...} or \sqrt{...} or \pi or \degree that are NOT enclosed in $ or $$.
    // A simple heuristic: if there's no $ in the string at all, but there is \frac or \sqrt, wrap it all in $ if it's purely math, or wrap the commands.
    
    // A better approach for the DB:
    let parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) { // Text parts
            // Replace standalone \frac{...}{...} with $\frac{...}{...}$
            // This is complex. We can just run a regex that matches \frac{...}{...}
            parts[i] = parts[i].replace(/(\\frac\s*\{[^{}]*\}(?:\s*\{[^{}]*\})?)/g, '$$$1$$');
            parts[i] = parts[i].replace(/(\\sqrt\s*\{[^{}]*\})/g, '$$$1$$');
            parts[i] = parts[i].replace(/(\\pi)/g, '$$$1$$');
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
console.log('Fixed math_bank.json');
