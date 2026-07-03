const fs = require('fs');
const content = fs.readFileSync('./.next/dev/server/chunks/ssr/src_data_math_bank_json_91171041._.js', 'utf8');

const regex = /JSON\.parse\("([\s\S]*)"\)/;
const match = content.match(regex);
if (match) {
    const rawString = match[1];
    // Since it's a JS string literal representing JSON, we can evaluate it
    const evalString = '"' + rawString + '"';
    const jsonString = eval(evalString);
    const parsed = JSON.parse(jsonString);
    fs.writeFileSync('src/data/math_bank.json', JSON.stringify(parsed, null, 2), 'utf8');
    console.log("Recovered math_bank.json! count: " + parsed.length);
} else {
    console.log("Failed to match regex");
}
