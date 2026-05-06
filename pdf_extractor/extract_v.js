const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    try {
        for (let v of ['V1', 'V2', 'V3']) {
            let dataBuffer = fs.readFileSync(`../${v}.pdf`);
            let data = await pdf(dataBuffer);
            fs.writeFileSync(`../${v}.txt`, data.text);
            console.log(`${v} extracted.`);
        }
    } catch(e) {
        console.error(e);
    }
}
extract();
