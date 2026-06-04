import re
import json

with open('test1_questions.txt', 'r') as f:
    lines = f.readlines()

questions = []
current_q = None
options = []
passage = []
q_text = ""

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    # Check for question start
    q_match = re.match(r'\*\*(\d+)\.\s+(.*?)\*\*', line)
    if q_match:
        if current_q is not None:
            questions.append(current_q)
        q_num = int(q_match.group(1))
        q_text = q_match.group(2)
        current_q = {
            "num": q_num,
            "question": q_text,
            "passage": "",
            "options": [],
            "answer": -1
        }
        passage = []
        options = []
        continue
        
    # Options A, B, C, D
    opt_match = re.match(r'([A-D])\.\s+(.*)', line)
    if opt_match and current_q:
        current_q['options'].append(opt_match.group(2))
        continue
        
    # Answer
    ans_match = re.match(r'\*\*Answer:\s+([A-D]|\d+)\*\*', line)
    if ans_match and current_q:
        ans_val = ans_match.group(1)
        if ans_val in ['A', 'B', 'C', 'D']:
            current_q['answer'] = ord(ans_val) - 65
        else:
            current_q['answer'] = ans_val
        continue
        
    if line.startswith('**Answer:'):
        # some other answer format
        if current_q:
            ans_val = line.split('**Answer:')[1].split('*')[0].strip()
            current_q['answer'] = ans_val
        continue
        
    # If it's not a known prefix, it's probably passage
    if current_q and not line.startswith('<truncated'):
        passage.append(line)

if current_q:
    questions.append(current_q)

for q in questions:
    q['passage'] = "\n".join(q.get('passage_lines', passage)).strip() # Wait, I didn't save passage to q directly during the loop.

# Fix the passage logic
questions = []
current_q = None

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    q_match = re.match(r'\*\*(\d+)\.\s+(.*?)\*\*', line)
    if not q_match:
        q_match = re.match(r'\*\*(\d+)\.\*\*', line)
    
    if q_match:
        if current_q is not None:
            current_q['passage'] = "\n".join(current_q['passage_lines']).strip()
            del current_q['passage_lines']
            questions.append(current_q)
        q_num = int(q_match.group(1))
        q_text = q_match.group(2) if len(q_match.groups()) > 1 else ""
        current_q = {
            "num": q_num,
            "question": q_text,
            "passage_lines": [],
            "options": [],
            "answer": -1
        }
        continue
        
    opt_match = re.match(r'([A-D])\.\s+(.*)', line)
    if opt_match and current_q:
        current_q['options'].append(opt_match.group(2))
        continue
        
    ans_match = re.match(r'\*\*Answer:\s+([A-D]|\d+)\*\*', line)
    if ans_match and current_q:
        ans_val = ans_match.group(1)
        if ans_val in ['A', 'B', 'C', 'D']:
            current_q['answer'] = ord(ans_val) - 65
        else:
            current_q['answer'] = ans_val
        continue
        
    if line.startswith('**Answer:'):
        if current_q:
            ans_val = line.split('**Answer:')[1].split('*')[0].strip()
            current_q['answer'] = ans_val
        continue
        
    if current_q and not line.startswith('<truncated') and not line.startswith('Section 1') and not line.startswith('##') and not line.startswith('y $f(x)='):
        current_q['passage_lines'].append(line)

if current_q:
    current_q['passage'] = "\n".join(current_q['passage_lines']).strip()
    del current_q['passage_lines']
    questions.append(current_q)

# Load explanations
with open('test1_explanations.txt', 'r') as f:
    exp_text = f.read()

def parse_expl(text):
    parts = re.split(r'\n(\d+)\n', '\n' + text)
    exps = {}
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        exps[num] = parts[i+1].strip()
    return exps

exps = parse_expl(exp_text)

# Assign explanations
for q in questions:
    q['explanation'] = exps.get(q['num'], "")
    q['id'] = f"pt1-m1-q{q['num']}"
    q['difficulty'] = 'Medium'
    if not q['question']:
        q['type'] = 'Math'
        q['question'] = q['passage']
        q['passage'] = ""
    else:
        q['type'] = 'Reading'

with open('pt1_parsed_from_txt.json', 'w') as f:
    json.dump(questions, f, indent=2)
print(f"Parsed {len(questions)} questions from test1_questions.txt")
