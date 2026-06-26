const fs = require('fs');

const tsFile = 'src/data/questions.ts';
let content = fs.readFileSync(tsFile, 'utf8');

function wrapMath(str) {
    if (typeof str !== 'string') return str;
    str = str.trim();
    if (!str) return str;
    if (str.startsWith('$') && str.endsWith('$')) return str;
    if (str.startsWith('$$') && str.endsWith('$$')) return str;
    
    // For math options, wrap if it's a number, a formula, or contains math symbols
    // Exclude full English sentences.
    if (!/[a-zA-Z]{5,}/.test(str) || str.includes('^') || str.includes('\\frac')) {
        return `$${str}$`;
    }
    return str;
}

const varsToFormat = [
    'pt1_mathModule1',
    'pt1_mathModule2',
    'pt2_mathModule1',
    'pt2_mathModule2'
];

varsToFormat.forEach(varName => {
    // Regex to match the array definition
    const regex = new RegExp(`export const ${varName}: Question\\[\\] = (\\[[\\s\\S]*?\\]);\\n(?:export const|const)`);
    const match = content.match(regex);
    if (!match) {
        // Try without 'export const' following it
        const regex2 = new RegExp(`export const ${varName}: Question\\[\\] = (\\[[\\s\\S]*?\\]);\\n`);
        const match2 = content.match(regex2);
        if (match2) {
            let arr = eval(match2[1]);
            arr.forEach(q => {
                if (q.options) {
                    q.options = q.options.map(wrapMath);
                }
            });
            const newContent = `export const ${varName}: Question[] = ${JSON.stringify(arr, null, 4)};\n`;
            content = content.replace(match2[0], newContent);
            console.log(`Updated ${varName}`);
        } else {
            console.log(`Could not find ${varName}`);
        }
    } else {
        let arr = eval(match[1]);
        arr.forEach(q => {
            if (q.options) {
                q.options = q.options.map(wrapMath);
            }
        });
        const nextDecl = match[0].substring(match[0].length - 13); // simplistic way to keep the following declaration
        const newContent = `export const ${varName}: Question[] = ${JSON.stringify(arr, null, 4)};\n${nextDecl.includes('export') ? 'export const' : 'const'}`;
        // Actually, just doing replace on the match is tricky.
    }
});

// A safer way: just use JSON.parse after splitting!
