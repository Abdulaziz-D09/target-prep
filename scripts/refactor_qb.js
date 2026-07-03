const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/app/question-bank/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add Supabase import
content = content.replace(
  "import { ReferenceSheet } from '@/components/ReferenceSheet';",
  "import { ReferenceSheet } from '@/components/ReferenceSheet';\nimport { createClient } from '@/lib/supabase/client';"
);

// 2. Remove json imports
content = content.replace("import ebrwData from '@/data/ebrw_bank.json';\n", "");
content = content.replace("import mathData from '@/data/math_bank.json';\n", "");

// 3. Remove global const assignments (but keep the empty arrays so types don't break if referenced globally by mistake before mount)
content = content.replace(
  /const allEnglishQuestions: Question\[\] = \(ebrwData.*?\}\);\n    \}\);/s,
  "// allEnglishQuestions is now fetched from Supabase\n// const allEnglishQuestions: Question[] = [];"
);
content = content.replace(
  /const allMathQuestions: Question\[\] = \[.*?\n\}\)\);/s,
  "// allMathQuestions is now fetched from Supabase\n// const allMathQuestions: Question[] = [];"
);
content = content.replace(
  /const allQuestionBankQuestions = \[\.\.\.allEnglishQuestions, \.\.\.allMathQuestions\];/g,
  ""
);

// We need to inject the fetch logic into QuestionBankPage
const fetchLogic = `
  const [dbEnglishQuestions, setDbEnglishQuestions] = useState<Question[]>([]);
  const [dbMathQuestions, setDbMathQuestions] = useState<Question[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      const [{ data: mathData }, { data: ebrwData }] = await Promise.all([
        supabase.from('question_bank').select('*').eq('subject', 'Math').limit(5000),
        supabase.from('question_bank').select('*').eq('subject', 'EBRW').limit(5000)
      ]);
      
      const mathQ: Question[] = (mathData || []).map(row => {
          const q = row.question_data || {};
          return {
              id: row.id,
              type: q.type || 'Math',
              passage: q.passage || '',
              question: q.question || '',
              options: Array.isArray(q.options) ? q.options : [],
              answer: typeof q.answer === 'number' ? q.answer : undefined,
              answerType: q.answerType || (typeof q.answer === 'number' ? 'multiple_choice' : 'numeric'),
              answerText: q.answerText,
              acceptableAnswers: Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers : undefined,
              explanation: q.explanation || '',
              difficulty: row.difficulty || 'Medium',
              domain: row.domain || 'Math',
              skill: row.skill || 'Math',
              image: q.image,
              imageLayout: q.imageLayout,
          };
      });
      // also include procedural math
      const proceduralM = proceduralMathQuestions.map(q => ({
        id: q.id,
        type: q.type || 'Math',
        passage: q.passage || '',
        question: q.question || '',
        options: Array.isArray(q.options) ? q.options : [],
        answer: typeof q.answer === 'number' ? q.answer : undefined,
        answerType: q.answerType || (typeof q.answer === 'number' ? 'multiple_choice' : 'numeric'),
        answerText: q.answerText,
        acceptableAnswers: Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers : undefined,
        explanation: q.explanation || '',
        difficulty: q.difficulty || 'Medium',
        domain: q.domain || 'Math',
        skill: q.skill || 'Math',
        image: q.image,
        imageLayout: q.imageLayout,
      }));
      setDbMathQuestions([...mathQ, ...proceduralM]);

      const ebrwQ: Question[] = (ebrwData || []).map(row => {
          const q = row.question_data || {};
          return {
              id: row.id,
              type: q.type || 'Reading',
              passage: q.passage || '',
              question: q.question || '',
              options: Array.isArray(q.options) ? q.options : [],
              answer: typeof q.answer === 'number' ? q.answer : 0,
              answerType: 'multiple_choice',
              explanation: q.explanation || '',
              difficulty: row.difficulty || 'Medium',
              domain: row.domain || 'Reading',
              skill: row.skill || 'Reading',
              image: q.image,
          };
      });
      setDbEnglishQuestions(ebrwQ);
      setIsDbLoading(false);
    }
    loadData();
  }, []);

  if (isDbLoading) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
           <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p>Loading Question Bank from database...</p>
           </div>
        </div>
      );
  }
  const allEnglishQuestions = dbEnglishQuestions;
  const allMathQuestions = dbMathQuestions;
  const allQuestionBankQuestions = [...allEnglishQuestions, ...allMathQuestions];
`;

content = content.replace(
  "export default function QuestionBankPage() {\n",
  "export default function QuestionBankPage() {\n" + fetchLogic
);

// We must also fix BrowseView
content = content.replace(
  "function BrowseView({ onStartQuiz, reviewedIds, qbStats }: { onStartQuiz: (qs: Question[], label: string) => void; reviewedIds: Set<string>; qbStats: QBStats }) {",
  "function BrowseView({ onStartQuiz, reviewedIds, qbStats, allEnglishQuestions, allMathQuestions }: { onStartQuiz: (qs: Question[], label: string) => void; reviewedIds: Set<string>; qbStats: QBStats; allEnglishQuestions: Question[]; allMathQuestions: Question[]; }) {"
);

content = content.replace(
  "<BrowseView\n                    onStartQuiz={startQuiz}\n                    reviewedIds={reviewedIdSet}\n                    qbStats={qbStats}\n                />",
  "<BrowseView\n                    onStartQuiz={startQuiz}\n                    reviewedIds={reviewedIdSet}\n                    qbStats={qbStats}\n                    allEnglishQuestions={allEnglishQuestions}\n                    allMathQuestions={allMathQuestions}\n                />"
);

fs.writeFileSync(file, content);
console.log('Refactor complete.');
