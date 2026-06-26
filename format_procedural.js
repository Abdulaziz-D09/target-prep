const fs = require('fs');

const tsFile = 'src/data/proceduralMath.ts';
let content = fs.readFileSync(tsFile, 'utf8');

// The file exports a single array: export const proceduralMathQuestions = [ ... ];
// We can use a regex to extract the JSON array.
const match = content.match(/export const proceduralMathQuestions = (\[[\s\S]*\]);/);
if (match) {
    let arr = eval(match[1]); // eval is safe here, it's just our data
    
    function wrapMath(str) {
        if (typeof str !== 'string') return str;
        str = str.trim();
        if (!str) return str;
        // If it's already wrapped, skip
        if (str.startsWith('$') && str.endsWith('$')) return str;
        if (str.startsWith('$$') && str.endsWith('$$')) return str;
        
        // Wrap if it contains math symbols, digits, or letters with exponents
        // Actually, for math options, almost ALL of them should be wrapped if they are formulas or numbers!
        // Let's just wrap it if it's not a pure English sentence.
        if (!/[a-zA-Z]{4,}/.test(str) || str.includes('^')) {
            return `$${str}$`;
        }
        return str;
    }

    arr.forEach(q => {
        if (q.options) {
            q.options = q.options.map(wrapMath);
        }
    });

    const newContent = `export const proceduralMathQuestions = ${JSON.stringify(arr, null, 2)};`;
    fs.writeFileSync(tsFile, newContent);
    console.log("Updated proceduralMath.ts");
} else {
    console.log("Could not find array in proceduralMath.ts");
}
