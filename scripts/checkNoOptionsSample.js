const mathData = require('../src/data/math_bank.json');
const rejects = [];

mathData.forEach(q => {
    const isNumeric = q.answerType === 'numeric' || (q.answerText && !q.options) || (Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.length > 0);
    if (!isNumeric) {
        if (!Array.isArray(q.options) || q.options.length < 2) rejects.push(q);
    }
});

console.log(JSON.stringify(rejects.slice(0, 3), null, 2));
