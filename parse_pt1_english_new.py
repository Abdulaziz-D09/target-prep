import re
import json

with open('test1_questions.txt', 'r') as f:
    text = f.read()

# We will just find all \n1.\n, \n2.\n... up to \n27.\n
# A robust way is to use re.finditer to find all questions 1-27.
# Since we expect two modules of 27 questions each, we can just collect all questions
# and the first 27 will be M1, the next 27 will be M2!
# Actually, the user's index says "unknown (27), easy (27), hard (27)".
# But the text only contains one Module 1 and one Module 2.
# Let's clean up Answer tags
text = re.sub(r'Answer:\s*([A-D])', r'ANSWER_MARK: \1', text, flags=re.IGNORECASE)

# Find all blocks starting with \n[1-27].\n
blocks = re.split(r'\n(\d+)\.\s*\n', '\n' + text)
if len(blocks) < 5:
    blocks = re.split(r'\n(\d+)\.\s+', '\n' + text)

all_qs = []
for i in range(1, len(blocks), 2):
    try:
        num = int(blocks[i])
    except:
        continue
    
    content = blocks[i+1].strip()
    
    ans_val = -1
    ans_match = re.search(r'ANSWER_MARK:\s*([A-D])', content)
    if ans_match:
        ans_char = ans_match.group(1).upper()
        ans_val = ord(ans_char) - 65
        content = content[:ans_match.start()].strip()
        
    opt_match = re.search(r'\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)', content, re.DOTALL)
    options = []
    q_text = content
    if opt_match:
        options = [opt_match.group(1).strip(), opt_match.group(2).strip(), opt_match.group(3).strip(), opt_match.group(4).strip()]
        q_text = content[:opt_match.start()].strip()
        
    all_qs.append({
        "num": num,
        "type": "Reading",
        "question": q_text,
        "options": options,
        "answer": ans_val,
        "difficulty": "Medium"
    })

# filter out math questions (num > 27 or something?)
# But wait, math might be in the file. The math questions were \n1.\n, etc.
# We will just take the first 27 as Module 1, and the next 27 as Module 2.
qs1 = []
qs2 = []

current_mod = 1
for q in all_qs:
    if current_mod == 1:
        qs1.append(q)
        if len(qs1) == 27:
            current_mod = 2
    elif current_mod == 2:
        qs2.append(q)
        if len(qs2) == 27:
            current_mod = 3

for q in qs1:
    q["id"] = f"pt1-m1-q{q['num']}"
for q in qs2:
    q["id"] = f"pt1-m2-q{q['num']}"
    q["difficulty"] = "Hard"

print("M1 qs:", len(qs1))
print("M2 qs:", len(qs2))

# Explanations
with open('test1_explanations.txt', 'r') as f:
    exp_text = f.read()

e_parts = re.split(r'MODULE \d+ \(\d+ Questions\)', exp_text)
if len(e_parts) >= 3:
    def parse_expl(t):
        p = re.split(r'\nQuestion (\d+) \u2014 Answer:', '\n' + t)
        exps = {}
        for i in range(1, len(p), 2):
            exps[int(p[i])] = p[i+1].strip()
        return exps
    e1 = parse_expl(e_parts[1])
    e2 = parse_expl(e_parts[2])
    for q in qs1:
        q['explanation'] = e1.get(q['num'], "")
    for q in qs2:
        q['explanation'] = e2.get(q['num'], "")

with open('pt1_english_full.json', 'w') as f:
    json.dump([{"questions": qs1}, {"questions": qs2}], f, indent=2)

