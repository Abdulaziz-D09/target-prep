import re

with open("test1_questions.txt", "r") as f:
    text = f.read()

start_marker = "### Section 2, Module 2: Math"
start_idx = text.find(start_marker)
chunk = text[start_idx:]
parts = re.split(r'(\n)(?=\d+\.\s*|\*\*\d+\.\*\*\s*)', '\n' + chunk)

q_chunk = parts[4] # Q2 should be here (1 is parts[2])
opt_matches = list(re.finditer(r'(?:^|\n)\s*([A-D])\.\s*', q_chunk))
abcd_matches = []
for match in reversed(opt_matches):
    abcd_matches.append(match)
    if match.group(1) == 'A' and len(abcd_matches) >= 4:
        break
abcd_matches.reverse()
if len(abcd_matches) >= 4 and [m.group(1) for m in abcd_matches[-4:]] == ['A', 'B', 'C', 'D']:
    opt_matches = abcd_matches[-4:]

opts_start = opt_matches[0].start()
main_text = q_chunk[:opts_start].strip()
question = re.sub(r'^\s*\d+\.\s*\n*', '', main_text).strip()
print("Q:", repr(question))

