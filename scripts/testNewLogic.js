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
    if (isNumeric) return true; // SPR questions don't need options
    
    // MC must have at least 2 clean options
    if (!Array.isArray(q.options) || q.options.length < 2) return false;
    
    // Options shouldn't contain explanation text, but can be short (e.g. "4", "2x")
    const optionIsGarbled = (opt) => {
        const t = (opt || '').toLowerCase();
        return t.includes('choice a is incorrect') || t.includes('is incorrect.');
    };
    
    if (q.options.some(o => optionIsGarbled(o))) return false;
    return true;
}

const valid = mathData.filter(isValidMathQuestion);
console.log('Total valid math questions NOW:', valid.length);
