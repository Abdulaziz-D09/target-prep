const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('../Practice test 1.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('pt1_extracted.txt', data.text);
    console.log("PDF text extracted to pt1_extracted.txt");
}).catch(err => {
    console.error("Error parsing PDF", err);
});
