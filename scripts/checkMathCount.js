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

const valid = mathData.filter(isValidMathQuestion);
console.log('Total valid math questions:', valid.length);
