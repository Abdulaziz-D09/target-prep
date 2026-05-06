import re

with open('src/data/questions.ts', 'r') as f:
    data = f.read()

tests = re.split(r'id: \d+,\s*title: "Practice Test \d+",', data)[1:]
for i, t in enumerate(tests[:5]):
    passage = re.search(r'passage: `([^`]*)`', t)
    print(f"Test {i+1} Q1: {passage.group(1)[:60] if passage else 'None'}")
