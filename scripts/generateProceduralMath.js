const fs = require('fs');

const questions = [];

// Helper functions
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

// Templates
function genLinearSystem() {
    // ax + by = c
    // dx + ey = f
    const x = randInt(-10, 10);
    const y = randInt(-10, 10);
    const a = randInt(1, 5);
    const b = randInt(1, 5);
    const d = randInt(1, 5);
    const e = randInt(-5, -1);
    
    const c = a * x + b * y;
    const f = d * x + e * y;

    const question = `If $(x, y)$ is the solution to the system of equations below, what is the value of $x + y$?\n\n$$${a}x + ${b}y = ${c}$$\n$$${d}x ${e}y = ${f}$$`;
    const answer = x + y;
    
    // Generate distractors
    const options = shuffle([
        `${answer}`,
        `${x - y}`,
        `${Math.abs(x) + Math.abs(y)}`,
        `${x + 2*y}`
    ]);
    
    // Ensure uniqueness in options
    const uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
        uniqueOptions.push(`${randInt(-20, 20)}`);
        uniqueOptions.splice(0, uniqueOptions.length, ...new Set(uniqueOptions));
    }
    
    return {
        id: `proc-sys-${Math.random().toString(36).substr(2, 9)}`,
        type: 'Math',
        question: question,
        options: uniqueOptions,
        answer: uniqueOptions.indexOf(`${answer}`),
        explanation: `We can solve this system by substitution or elimination. The solution is $x = ${x}$ and $y = ${y}$, so $x + y = ${answer}$.`
    };
}

function genCircleEquation() {
    // (x - h)^2 + (y - k)^2 = r^2
    // x^2 - 2hx + h^2 + y^2 - 2ky + k^2 = r^2
    const h = randInt(-8, 8);
    const k = randInt(-8, 8);
    const r = randInt(2, 12);
    
    const hTerm = -2 * h;
    const kTerm = -2 * k;
    const constant = h * h + k * k - r * r;

    let eq = `$x^2 + y^2`;
    if (hTerm !== 0) eq += ` ${hTerm > 0 ? '+' : '-'} ${Math.abs(hTerm)}x`;
    if (kTerm !== 0) eq += ` ${kTerm > 0 ? '+' : '-'} ${Math.abs(kTerm)}y`;
    eq += ` ${constant > 0 ? '+' : '-'} ${Math.abs(constant)} = 0$`;

    const question = `The equation of a circle in the $xy$-plane is shown below. What is the radius of the circle?\n\n${eq}`;
    const answer = r;
    
    const options = shuffle([`${r}`, `${r*r}`, `${Math.abs(h)}`, `${Math.abs(k)}`]);
    const uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
        uniqueOptions.push(`${randInt(1, 144)}`);
        uniqueOptions.splice(0, uniqueOptions.length, ...new Set(uniqueOptions));
    }

    return {
        id: `proc-circ-${Math.random().toString(36).substr(2, 9)}`,
        type: 'Math',
        question: question,
        options: uniqueOptions,
        answer: uniqueOptions.indexOf(`${answer}`),
        explanation: `By completing the square for $x$ and $y$, the equation becomes $(x - ${h})^2 + (y - ${k})^2 = ${r*r}$. The radius is $\\sqrt{${r*r}} = ${r}$.`
    };
}

function genQuadraticVertex() {
    // y = a(x - h)^2 + k
    // y = ax^2 - 2ahx + ah^2 + k
    const a = randChoice([-3, -2, -1, 1, 2, 3]);
    const h = randInt(-10, 10);
    const k = randInt(-10, 10);
    
    const b = -2 * a * h;
    const c = a * h * h + k;

    const question = `The graph of the quadratic equation $y = ${a === 1 ? '' : a === -1 ? '-' : a}x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}$ is a parabola. What is the $y$-coordinate of the vertex of this parabola?`;
    const answer = k;

    const options = shuffle([`${k}`, `${h}`, `${-k}`, `${-h}`]);
    const uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
        uniqueOptions.push(`${randInt(-20, 20)}`);
        uniqueOptions.splice(0, uniqueOptions.length, ...new Set(uniqueOptions));
    }

    return {
        id: `proc-quad-${Math.random().toString(36).substr(2, 9)}`,
        type: 'Math',
        question: question,
        options: uniqueOptions,
        answer: uniqueOptions.indexOf(`${answer}`),
        explanation: `The vertex form is $y = a(x - h)^2 + k$. Using $x = \\frac{-b}{2a}$, we get $x = \\frac{${-b}}{${2*a}} = ${h}$. Plugging $x = ${h}$ back into the equation gives $y = ${k}$, which is the $y$-coordinate of the vertex.`
    };
}

function genPercentage() {
    const p1 = randInt(1, 9) * 10;
    const p2 = randInt(1, 9) * 10;
    const base = randInt(2, 20) * 10;
    
    const intermediate = (p1 / 100) * base;
    const target = (p2 / 100) * base;

    const question = `If $${p1}\\%$ of $x$ is $${intermediate}$, what is $${p2}\\%$ of $x$?`;
    const answer = target;

    const options = shuffle([`${target}`, `${base}`, `${intermediate * 2}`, `${target * 1.5}`]);
    const uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
        uniqueOptions.push(`${randInt(10, 200)}`);
        uniqueOptions.splice(0, uniqueOptions.length, ...new Set(uniqueOptions));
    }

    return {
        id: `proc-perc-${Math.random().toString(36).substr(2, 9)}`,
        type: 'Math',
        question: question,
        options: uniqueOptions,
        answer: uniqueOptions.indexOf(`${answer}`),
        explanation: `First find $x$: $0.${p1 / 10}x = ${intermediate}$, so $x = ${base}$. Then find $${p2}\\%$ of $x$: $0.${p2 / 10} \\times ${base} = ${target}$.`
    };
}

function genExponents() {
    const base = randChoice(['x', 'y', 'a', 'b']);
    const exp1 = randInt(2, 8);
    const exp2 = randInt(2, 8);
    
    const isMult = Math.random() > 0.5;
    
    const question = isMult 
        ? `Which of the following expressions is equivalent to $(${base}^${exp1})(${base}^${exp2})$?`
        : `Which of the following expressions is equivalent to $\\frac{${base}^${exp1 + exp2}}{${base}^${exp2}}$?`;
        
    const answer = `${base}^{${exp1 + exp2}}`;
    const answerDiv = `${base}^{${exp1}}`;
    
    const actualAns = isMult ? answer : answerDiv;
    const wrong1 = `${base}^{${exp1 * exp2}}`;
    const wrong2 = isMult ? `${base}^{${Math.abs(exp1 - exp2)}}` : `${base}^{${exp1 + 2*exp2}}`;
    const wrong3 = `${base}^{${exp1 + exp2 + 1}}`;

    const options = shuffle([actualAns, wrong1, wrong2, wrong3]);

    return {
        id: `proc-exp-${Math.random().toString(36).substr(2, 9)}`,
        type: 'Math',
        question: question,
        options: options,
        answer: options.indexOf(actualAns),
        explanation: isMult 
            ? `When multiplying terms with the same base, add their exponents: $${exp1} + ${exp2} = ${exp1 + exp2}$.`
            : `When dividing terms with the same base, subtract their exponents: $${exp1 + exp2} - ${exp2} = ${exp1}$.`
    };
}

// Generate 1540 questions
const TOTAL_NEEDED = 1540;
const generators = [genLinearSystem, genCircleEquation, genQuadraticVertex, genPercentage, genExponents];

for (let i = 0; i < TOTAL_NEEDED; i++) {
    const generator = randChoice(generators);
    questions.push(generator());
}

const fileContent = `export const proceduralMathQuestions = ${JSON.stringify(questions, null, 2)};\n`;
fs.writeFileSync('./src/data/proceduralMath.ts', fileContent);
console.log('Successfully generated ' + questions.length + ' math questions!');
