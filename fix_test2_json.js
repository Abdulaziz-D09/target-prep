const fs = require('fs');

const rawData = fs.readFileSync('test2_parsed.json', 'utf8');
const data = JSON.parse(rawData);

// Save to both test2_reading.json and test2_parsed.json
fs.writeFileSync('test2_parsed.json', JSON.stringify(data, null, 2));
fs.writeFileSync('test2_reading.json', JSON.stringify(data, null, 2));

console.log("Copied test2_parsed to test2_reading");
