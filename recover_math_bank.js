const fs = require('fs');
const content = fs.readFileSync('./.next/dev/server/chunks/ssr/src_data_math_bank_json_91171041._.js', 'utf8');

// The chunk usually has `JSON.parse("...")` or `module.exports = [...]`
let parsed;
try {
    // We can evaluate it safely or just run it as a module?
    // Let's create a temporary fake environment and eval it.
    const fakeEnv = `
        const module = { exports: {} };
        const globalThis = { TURBOPACK: { registerChunk: () => {} } };
        ${content}
        return module.exports;
    `;
    // Or simpler: match the array
    const startIdx = content.indexOf('[');
    const endIdx = content.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1) {
        const jsonStr = content.substring(startIdx, endIdx + 1);
        try {
            parsed = JSON.parse(jsonStr);
        } catch(e) {
            console.log("Direct JSON parse failed. It might be JS array literal or JSON.parse wrapped.");
        }
    }
} catch (e) {
    console.log(e);
}

if (!parsed) {
    // Sometimes it's JSON.parse('...')
    const match = content.match(/JSON\.parse\((['"`])(.*)\1\)/);
    if (match) {
        try {
            parsed = JSON.parse(match[2].replace(/\\\\/g, '\\')); // unescape? No, JSON.parse handles string
        } catch(e) {}
    }
}

if (!parsed) {
    console.log("Failed to extract JSON.");
} else {
    fs.writeFileSync('src/data/math_bank.json', JSON.stringify(parsed, null, 2), 'utf8');
    console.log("Successfully recovered math_bank.json with " + parsed.length + " items!");
}
