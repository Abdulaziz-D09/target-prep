import re

with open("test1_questions.txt", "r") as f:
    text = f.read()

start_marker = "### Section 2, Module 2: Math"
start_idx = text.find(start_marker)
chunk = text[start_idx:]
parts = re.split(r'(\n)(?=\d+\.\s*|\*\*\d+\.\*\*\s*)', '\n' + chunk)

questions = []
for i in range(1, len(parts), 2):
    if i+1 >= len(parts):
        break
    part = parts[i+1].strip()
    match = re.match(r'^(\d+)\.', part)
    if match:
        print(match.group(1))

