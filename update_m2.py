import json
import re
import uuid

with open('module2_parsed.json', 'r') as f:
    parsed_qs = json.load(f)

# Extract explanations
with open('test1_explanations.txt', 'r') as f:
    exp_text = f.read()

# Get section for Module 2 English
exp_start = exp_text.find("Section 1, Module 2: Reading & Writing — Hard")
exp_end = exp_text.find("Section 2, Module 2: Math — Hard") # wait, what about Math Module 1? The text says Section 2, Module 2: Math - Hard at the end of the grep? Let's just use substring.
exp_section = exp_text[exp_start:exp_end] if exp_end != -1 else exp_text[exp_start:]

exp_list = []
# split by "1\n\nWords in Context", "2\n\n", etc.
# Actually, the user's explanations format has numbers like "\n1\n\n" or "\n2\n\n"
exp_chunks = re.split(r'\n\n(\d+)\n\n', exp_section)
# exp_chunks[0] is prologue
current_q = 1
explanations = {}
for i in range(1, len(exp_chunks), 2):
    q_num = exp_chunks[i]
    q_text = exp_chunks[i+1]
    explanations[q_num] = q_text.strip()

questions_ts = []
for q in parsed_qs:
    pq = q['passage_q']
    if '?' in pq:
        idx = pq.index('?')
        question = pq[:idx+1].strip()
        passage = pq[idx+1:].strip()
    else:
        question = pq
        passage = ""
        
    ans_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
    ans_idx = ans_map.get(q['answer'], 0)
    
    exp = explanations.get(str(q['num']), "Explanation not provided.")
    exp_escaped = exp.replace('`', '\\`')
    
    passage_escaped = passage.replace('"', '\\"').replace('\n', '\\n')
    question_escaped = question.replace('"', '\\"').replace('\n', '\\n')
    
    options_escaped = [opt.replace('"', '\\"') for opt in q['options']]
    options_str = ", ".join(['"' + opt + '"' for opt in options_escaped])
    
    ts_code = f"""      {{
          id: "{uuid.uuid4().hex[:8]}",
          type: "Reading",
          passage: "{passage_escaped}",
          question: "{question_escaped}",
          options: [{options_str}],
          answer: {ans_idx},
          explanation: `{exp_escaped}`,
          difficulty: "Hard",
        }},"""
    questions_ts.append(ts_code)

replacement_code = "\n".join(questions_ts)

with open('src/data/questions.ts', 'r') as f:
    lines = f.readlines()

# Find module 2 start
mod2_idx = -1
count = 0
for i, line in enumerate(lines):
    if "timeMinutes: 32" in line:
        count += 1
        if count == 2: # Module 2 Reading
            mod2_idx = i
            break

# find questions: [
q_start = -1
for i in range(mod2_idx, len(lines)):
    if "questions: [" in lines[i]:
        q_start = i
        break

# find the end of this questions array
q_end = -1
open_brackets = 1
for i in range(q_start + 1, len(lines)):
    open_brackets += lines[i].count('[')
    open_brackets -= lines[i].count(']')
    if open_brackets == 0:
        q_end = i
        break

new_lines = lines[:q_start+1] + [replacement_code + "\n"] + lines[q_end:]

with open('src/data/questions.ts', 'w') as f:
    f.writelines(new_lines)

print(f"Successfully replaced questions between line {q_start} and {q_end}")
