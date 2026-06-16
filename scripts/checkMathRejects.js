const fs = require('fs');
const mathData = require('../src/data/math_bank.json');

function isGarbled(text) {
    const t = (text || '').toLowerCase();
    return t.includes('choice a is incorrect') ||
        t.includes('is incorrect.') ||
        t.includes('choice b is incorrect') ||
        t.length < 5;
}

function isValidMathQuestion(q) {
    if (!q.question || isGarbled(q.question)) return false;
    const isNumeric = q.answerType === 'numeric' ||
        (q.answerText && !q.options) ||
        (Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.length > 0);
    if (isNumeric) return true;
    if (!Array.isArray(q.options) || q.options.length < 4) return false;
    if (q.options.some(o => isGarbled(o))) return false;
    return true;
}

const rejects = mathData.filter(q => !isValidMathQuestion(q));
console.log('Total rejects:', rejects.length);
console.log('Sample reject:', JSON.stringify(rejects[0], null, 2));

const reasons = { noQ: 0, garbledQ: 0, noOptionsMC: 0, garbledOption: 0 };
mathData.forEach(q => {
    if (!q.question) reasons.noQ++;
    else if (isGarbled(q.question)) reasons.garbledQ++;
    else {
        const isNumeric = q.answerType === 'numeric' || (q.answerText && !q.options) || (Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.length > 0);
        if (!isNumeric) {
            if (!Array.isArray(q.options) || q.options.length < 4) reasons.noOptionsMC++;
            else if (q.options.some(o => isGarbled(o))) reasons.garbledOption++;
        }
    }
});
console.log('Reasons:', reasons);
