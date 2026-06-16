const mathData = require('../src/data/math_bank.json');

const rejects = mathData.filter(q => {
    const isNumeric = q.answerType === 'numeric' || (q.answerText && !q.options) || (Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.length > 0);
    if (!isNumeric) {
        return (!Array.isArray(q.options) || q.options.length < 4);
    }
    return false;
});

console.log(JSON.stringify(rejects[0], null, 2));
