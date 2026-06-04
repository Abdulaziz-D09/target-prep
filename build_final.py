import json

# 1. Load data
with open('pt1_english_full.json', 'r') as f:
    pt1_eng = json.load(f)
with open('pt1_math_parsed.json', 'r') as f:
    pt1_math = json.load(f)
with open('test2_parsed.json', 'r') as f:
    pt2_eng = json.load(f)
with open('test2_math.json', 'r') as f:
    pt2_math = json.load(f)

# 2. Extract original header
with open('src/data/questions.ts', 'r') as f:
    content = f.read()
    
# We want to keep everything from the beginning until `export const practiceTests`
header = content.split('export const pt1_englishModule1')[0] # Fallback
if 'export const pt1_englishModule1' not in content:
    header = content.split('export const practiceTests')[0]
    
# Also extract the footer (satDates, studyResources, etc.)
footer = "export const satDates" + content.split('export const satDates')[1]

# 3. Build modules
js = ""
js += f"const pt1_englishModule1: Question[] = {json.dumps(pt1_eng[0]['questions'], indent=4)};\n\n"
js += f"const pt1_englishModule2: Question[] = {json.dumps(pt1_eng[1]['questions'], indent=4)};\n\n"
js += f"const pt1_mathModule1: Question[] = {json.dumps(pt1_math[0]['questions'], indent=4)};\n\n"
js += f"const pt1_mathModule2: Question[] = {json.dumps(pt1_math[1]['questions'], indent=4)};\n\n"

js += f"const pt2_englishModule1: Question[] = {json.dumps(pt2_eng[0]['questions'], indent=4)};\n\n"
js += f"const pt2_englishModule2: Question[] = {json.dumps(pt2_eng[1]['questions'], indent=4)};\n\n"
js += f"const pt2_mathModule1: Question[] = {json.dumps(pt2_math[0]['questions'], indent=4)};\n\n"
js += f"const pt2_mathModule2: Question[] = {json.dumps(pt2_math[1]['questions'], indent=4)};\n\n"

# 4. Build practiceTests array
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

final_content = header + js + footer

with open('src/data/questions.ts', 'w') as f:
    f.write(final_content)
    
print("Rebuilt questions.ts")
