const fs = require('fs');

const mdPath = '/Users/abdulazizdavronov/Downloads/MQB(925-1848).md';
if (!fs.existsSync(mdPath)) {
  console.log('File not found: ' + mdPath);
  process.exit(1);
}

const text = fs.readFileSync(mdPath, 'utf8');

// Split by Question ID:
const chunks = text.split(/(?:#+)?\s*(?:\*\*)?Question ID:\s*([a-f0-9]+)(?:\*\*)?/i);

const questions = [];
let unparsed = 0;

for (let i = 1; i < chunks.length; i += 2) {
  const qId = chunks[i];
  let chunkText = chunks[i+1];
  
  // Extract Domain, Skill, Difficulty
  let domain = "", skill = "", difficulty = "";
  const tableMatch = chunkText.match(/<td>SAT<\/td>\s*<td>Math<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>/is);
  if (tableMatch) {
    domain = tableMatch[1].replace(/<[^>]+>/g, '').trim();
    skill = tableMatch[2].replace(/<[^>]+>/g, '').trim();
    difficulty = tableMatch[3].replace(/<[^>]+>/g, '').trim();
  }

  // Extract Question text
  const qMatch = chunkText.match(/(?:#+|\*\*)\s*Question(?:\*\*)?([\s\S]*?)(?=(?:#+|\*\*)\s*Answer|#+\s*Correct Answer|Correct Answer:|Correct Answer\s*:|\*\*Correct Answer\*\*|\*\*Correct Answer:)/is);
  let question = qMatch ? qMatch[1].trim() : "";

  // Extract Options if multiple choice
  let options = [];
  const ansSectMatch = chunkText.match(/(?:#+|\*\*)\s*Answer(?:\*\*)?([\s\S]*?)(?=(?:#+|\*\*)\s*Correct Answer|Correct Answer:|Correct Answer\s*:|\*\*Correct Answer\*\*|\*\*Correct Answer:)/is);
  
  let optText = ansSectMatch ? ansSectMatch[1] : question;
  
  // Look for A., B., C., D. OR A), B), C), D)
  const optA = optText.match(/(?:^|\n)\s*A[\.\)]\s*(.*?)(?=\n\s*B[\.\)]|$)/is);
  const optB = optText.match(/(?:^|\n)\s*B[\.\)]\s*(.*?)(?=\n\s*C[\.\)]|$)/is);
  const optC = optText.match(/(?:^|\n)\s*C[\.\)]\s*(.*?)(?=\n\s*D[\.\)]|$)/is);
  const optD = optText.match(/(?:^|\n)\s*D[\.\)]\s*(.*?)(?=\n\s*(?:#+|\*\*)|$)/is);

  if (optA && optB && optC && optD) {
    options = [optA[1].trim(), optB[1].trim(), optC[1].trim(), optD[1].trim()];
    if (!ansSectMatch) {
       question = question.split(/(?:^|\n)\s*A[\.\)]/i)[0].trim();
    }
  }

  // Extract Correct Answer
  let answerStr = "";
  const correctMatch = chunkText.match(/(?:(?:#+|\*\*)\s*)?Correct Answer(?:\*\*)?\s*:?\s*(?:\*\*)?(.*?)(?:\*\*)?(?:\n|$)/is);
  if (correctMatch) {
    answerStr = correctMatch[1].trim();
  }

  let finalAnswer;
  if (options.length > 0 && /^[A-D]$/i.test(answerStr[0])) {
    finalAnswer = answerStr[0].toUpperCase().charCodeAt(0) - 65; 
  } else {
    finalAnswer = answerStr.replace(/\*\*/g, '').trim();
  }

  // Extract Rationale
  let rationale = "";
  const ratMatch = chunkText.match(/(?:#+|\*\*)\s*Rationale(?:\*\*)?([\s\S]*)/is);
  if (ratMatch) {
    rationale = ratMatch[1].trim();
  }

  if (question && finalAnswer !== undefined && finalAnswer !== "") {
    const isOptions = options.length > 0;
    questions.push({
      id: qId,
      type: isOptions ? "Math" : "Math (SPR)",
      difficulty: difficulty,
      passage: null,
      question: question,
      options: isOptions ? options : null,
      answer: finalAnswer,
      answerType: isOptions ? 'multiple_choice' : 'numeric',
      answerText: isOptions ? undefined : finalAnswer,
      explanation: rationale,
      domain: domain,
      skill: skill
    });
  } else {
    unparsed++;
  }
}

console.log(`Successfully parsed ${questions.length} questions. Failed: ${unparsed}`);

// Append to math_bank.json
const existing = JSON.parse(fs.readFileSync('src/data/math_bank.json', 'utf8'));
const allQuestions = [...existing, ...questions];
fs.writeFileSync('src/data/math_bank.json', JSON.stringify(allQuestions, null, 2));
console.log(`math_bank.json now has ${allQuestions.length} total questions.`);

