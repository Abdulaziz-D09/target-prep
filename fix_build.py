import json
import re

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

# Find the end of `export interface PracticeTest { ... }`
# We can just use a regex
match = re.search(r'export interface PracticeTest\s*\{.*?\n\}', content, re.DOTALL)
if match:
    header = content[:match.end()] + '\n\n'
else:
    print("Could not find PracticeTest interface!")
    header = ""

# Find the footer: `export const satDates`
footer_idx = content.find('export const satDates')
if footer_idx != -1:
    footer = content[footer_idx:]
else:
    footer = ""

with open('pt1_english_full.json', 'r') as f:
    pt1_eng = json.load(f)
with open('pt1_math_parsed.json', 'r') as f:
    pt1_math = json.load(f)
with open('test2_parsed.json', 'r') as f:
    pt2_eng = json.load(f)
with open('test2_math.json', 'r') as f:
    pt2_math = json.load(f)

js = ""
js += f"const pt1_englishModule1: Question[] = {json.dumps(pt1_eng[0]['questions'], indent=4)};\n\n"
js += f"const pt1_englishModule2: Question[] = {json.dumps(pt1_eng[1]['questions'], indent=4)};\n\n"
js += f"const pt1_mathModule1: Question[] = {json.dumps(pt1_math[0]['questions'], indent=4)};\n\n"
js += f"const pt1_mathModule2: Question[] = {json.dumps(pt1_math[1]['questions'], indent=4)};\n\n"

js += f"const pt2_englishModule1: Question[] = {json.dumps(pt2_eng[0]['questions'], indent=4)};\n\n"
js += f"const pt2_englishModule2: Question[] = {json.dumps(pt2_eng[1]['questions'], indent=4)};\n\n"
js += f"const pt2_mathModule1: Question[] = {json.dumps(pt2_math[0]['questions'], indent=4)};\n\n"
js += f"const pt2_mathModule2: Question[] = {json.dumps(pt2_math[1]['questions'], indent=4)};\n\n"

js += """export const practiceTests: PracticeTest[] = [
  {
    id: 1,
    title: "Practice Test 1",
    description: "Full-length Digital SAT practice test with Reading, Writing, and Math sections.",
    type: "Full Test",
    duration: "2h 14m",
    totalQuestions: 98,
    moduleCount: 4,
    color: "blue",
    sections: [
      {
        name: "Reading and Writing",
        modules: [
          { timeMinutes: 32, questions: pt1_englishModule1 },
          { timeMinutes: 32, questions: pt1_englishModule2 }
        ]
      },
      {
        name: "Math",
        modules: [
          { timeMinutes: 35, questions: pt1_mathModule1 },
          { timeMinutes: 35, questions: pt1_mathModule2 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Practice Test 2",
    description: "Full-length Digital SAT practice test with Reading, Writing, and Math sections.",
    type: "Full Test",
    duration: "2h 14m",
    totalQuestions: 98,
    moduleCount: 4,
    color: "blue",
    sections: [
      {
        name: "Reading and Writing",
        modules: [
          { timeMinutes: 32, questions: pt2_englishModule1 },
          { timeMinutes: 32, questions: pt2_englishModule2 }
        ]
      },
      {
        name: "Math",
        modules: [
          { timeMinutes: 35, questions: pt2_mathModule1 },
          { timeMinutes: 35, questions: pt2_mathModule2 }
        ]
      }
    ]
  }
];

"""

with open('src/data/questions.ts', 'w') as f:
    f.write(header + js + footer)

print("Fixed cleanly.")
