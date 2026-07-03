const fs = require('fs');

// We don't have jimp installed natively, but we can try to find the dominant color or just check if it has a white/grey background.
// Let's check the size
const stats = fs.statSync('public/math-bank/3f5a3602.png');
console.log("Size:", stats.size);
