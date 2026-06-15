import re

with open('test1_questions.txt', 'r') as f:
    lines = f.readlines()

start_idx = -1

for i, line in enumerate(lines):
    if "### Section 2, Module 2: Math" in line:
        start_idx = i
        break

if start_idx != -1:
    for i in range(start_idx, len(lines)):
        if '$' in lines[i]:
            lines[i] = lines[i].replace('$', ' ')

with open('test1_questions.txt', 'w') as f:
    f.writelines(lines)
print("Fixed $ marks in Module 2")
