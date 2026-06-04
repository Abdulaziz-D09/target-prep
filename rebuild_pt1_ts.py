import json
import re

with open('pt1_english_patched.json', 'r') as f:
    qs = json.load(f)

m1 = qs[:27]
m2 = qs[27:]

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

m1_str = "const englishModule1: Question[] = " + json.dumps(m1, indent=4) + ";"
m2_str = "const englishModule2: Question[] = " + json.dumps(m2, indent=4) + ";"

# Replace existing englishModule1 and englishModule2 (if they exist)
if 'const englishModule2' in content:
    content = re.sub(r'const englishModule1: Question\[\] = \[.*?\];', lambda m: m1_str, content, flags=re.DOTALL, count=1)
    content = re.sub(r'const englishModule2: Question\[\] = \[.*?\];', lambda m: m2_str, content, flags=re.DOTALL, count=1)
else:
    content = re.sub(r'const englishModule1: Question\[\] = \[.*?\];', lambda m: m1_str + '\n\n' + m2_str, content, flags=re.DOTALL, count=1)

# Update Practice Test 1 module 2
content = re.sub(r'\{\s*timeMinutes:\s*32,\s*questions:\s*\[\s*\{\s*"num":\s*"1",\s*"passage_q":.*?\]\s*\}', lambda m: '{\n            timeMinutes: 32,\n            questions: englishModule2\n          }', content, flags=re.DOTALL, count=1)

with open('src/data/questions.ts', 'w') as f:
    f.write(content)
print("Updated questions.ts")
