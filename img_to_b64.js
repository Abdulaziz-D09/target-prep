const fs = require('fs');
const buf = fs.readFileSync('public/math-bank/3f5a3602.png');
console.log(buf.toString('base64').substring(0, 100));
