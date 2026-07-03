const fs = require('fs');
const buf = fs.readFileSync('public/math-bank/3f5a3602.png');
// Just checking if it's a valid png and maybe we can use Jimp or sharp?
console.log("File size:", buf.length);
