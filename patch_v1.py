import json
import re

with open('pdf_extractor/v1_parsed.json', 'r') as f:
    qs = json.load(f)

with open('test1_explanations.txt', 'r') as f:
    e_text = f.read()

# The explanations file has sections:
# "Section 1, Module 1: Reading & Writing"
# "Section 1, Module 2: Reading & Writing" (or similar)
# Inside each, it has numbers "1", "2", "3" on their own lines.

# Split by module
modules = re.split(r'Section 1, Module \d+', e_text)
if len(modules) >= 3:
    m1_e = modules[1]
    m2_e = modules[2].split('Section 2')[0]
else:
    print("Could not split explanation modules")
    exit(1)

def parse_expl(text):
    # split by \n1\n, \n2\n, etc.
    parts = re.split(r'\n(\d+)\n', '\n' + text)
    exps = {}
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        content = parts[i+1].strip()
        # Grab from "Core Logic:" to the end, or just the whole thing
        match = re.search(r'(Core Logic:.*?)(?=\n\d+\n|\Z)', content, re.DOTALL)
        if match:
            exps[num] = match.group(1).strip()
        else:
            exps[num] = content
    return exps

m1_exps = parse_expl(m1_e)
m2_exps = parse_expl(m2_e)

for i in range(27):
    qs[i]['explanation'] = m1_exps.get(i+1, "Explanation not found.")
    qs[i]['id'] = f"pt1-m1-q{i+1}"
for i in range(27):
    qs[i+27]['explanation'] = m2_exps.get(i+1, "Explanation not found.")
    qs[i+27]['id'] = f"pt1-m2-q{i+1}"

with open('pt1_english_patched.json', 'w') as f:
    json.dump(qs, f, indent=4)
print("Patched explanations successfully.")
