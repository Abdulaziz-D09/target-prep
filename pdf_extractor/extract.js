const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('../SAT Suite Question Bank - Results.pdf');

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('extracted.txt', data.text);
    console.log("PDF text extracted to extracted.txt");
}).catch(err => {
    console.error("Error parsing PDF", err);
});
