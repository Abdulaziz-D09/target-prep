const fs = require('fs');

const mdPath1 = '/Users/abdulazizdavronov/Downloads/MQB(1-924).md';
const mdPath2 = '/Users/abdulazizdavronov/Downloads/MQB(925-1848).md';

function testFailed(mdPath) {
    const text = fs.readFileSync(mdPath, 'utf8');
    const chunks = text.split(/(?:#+)?\s*(?:\*\*)?Question ID:\s*([a-f0-9]+)(?:\*\*)?/i);
    let failed = [];
    for (let i = 1; i < chunks.length; i += 2) {
      const qId = chunks[i];
      let chunkText = chunks[i+1];
      
      const qMatch = chunkText.match(/(?:#+|\*\*)\s*Question(?:\*\*)?([\s\S]*?)(?=(?:#+|\*\*)\s*Answer|#+\s*Correct Answer|Correct Answer:|Correct Answer\s*:|\*\*Correct Answer\*\*|\*\*Correct Answer:)/is);
      let question = qMatch ? qMatch[1].trim() : "";

      let answerStr = "";
      const correctMatch = chunkText.match(/(?:(?:#+|\*\*)\s*)?Correct Answer(?:\*\*)?\s*:?\s*(?:\*\*)?(.*?)(?:\*\*)?(?:\n|$)/is);
      if (correctMatch) {
        answerStr = correctMatch[1].trim();
      }
      
      if (!question || !answerStr) {
          failed.push({id: qId, qLength: question.length, aLength: answerStr.length, textSnippet: chunkText.substring(0, 300)});
      }
    }
    return failed;
}

const f1 = testFailed(mdPath1);
console.log("Failed in pt1:", f1.length);
if (f1.length > 0) console.log(f1[0]);

const f2 = testFailed(mdPath2);
console.log("Failed in pt2:", f2.length);

