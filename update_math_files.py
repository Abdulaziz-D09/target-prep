import json
import uuid
import re

with open('math_parsed.json', 'r') as f:
    parsed = json.load(f)

m1_qs = parsed['m1'][:22]
m2_qs = parsed['m2'][:22]

def get_questions_code(questions_list, explanations_dict, difficulty):
    ts_code = []
    for q in questions_list:
        passage_escaped = ""
        question_escaped = q['question'].replace('"', '\\"').replace('\n', '\\n')
        
        # Determine explanation
        exp = explanations_dict.get(str(q['num']), "Explanation not provided.")
        exp_escaped = exp.replace('`', '\\`')
        
        if q['options']:
            options_escaped = [opt.replace('"', '\\"') for opt in q['options']]
            options_str = ", ".join(['"' + opt + '"' for opt in options_escaped])
            options_field = f"[{options_str}]"
            ans_idx = int(q['answer'])
        else:
            options_field = "[]"
            ans_idx = q['answer'] # numeric answer
            
        code = f"""      {{
          id: "{uuid.uuid4().hex[:8]}",
          type: "Math",
          passage: "{passage_escaped}",
          question: "{question_escaped}",
          options: {options_field},
          answer: {ans_idx},
          explanation: `{exp_escaped}`,
          difficulty: "{difficulty}",
          calc: True,
        }},"""
        # Note: Math doesn't use 'passage', but we include it as empty. We'll omit it if empty to keep clean.
        if not passage_escaped:
            code = code.replace('          passage: "",\n', '')
        # Fix calc to lowercase true
        code = code.replace('calc: True', 'calc: true')
        ts_code.append(code)
    return "\n".join(ts_code)

# We need explanations for M1 and M2. Wait, the explanations in questions.ts are ALREADY IN THERE!
# BUT if we overwrite the questions block, we'll lose those explanations.
# We must extract the existing explanations from questions.ts FIRST!

with open('src/data/questions.ts', 'r') as f:
    lines = f.readlines()

# Find Math Module 1
m1_start = -1
count = 0
for i, line in enumerate(lines):
    if 'name: "Math"' in line:
        for j in range(i, len(lines)):
            if "timeMinutes: 35" in lines[j]:
                m1_start = j
                break
        break

q1_start = -1
for i in range(m1_start, len(lines)):
    if "questions: [" in lines[i]:
        q1_start = i
        break

q1_end = -1
open_brackets = 1
for i in range(q1_start + 1, len(lines)):
    open_brackets += lines[i].count('[')
    open_brackets -= lines[i].count(']')
    if open_brackets == 0:
        q1_end = i
        break

# Find Math Module 2
m2_start = -1
for i in range(q1_end, len(lines)):
    if "timeMinutes: 35" in lines[i]:
        m2_start = i
        break

q2_start = -1
for i in range(m2_start, len(lines)):
    if "questions: [" in lines[i]:
        q2_start = i
        break

q2_end = -1
open_brackets = 1
for i in range(q2_start + 1, len(lines)):
    open_brackets += lines[i].count('[')
    open_brackets -= lines[i].count(']')
    if open_brackets == 0:
        q2_end = i
        break

m1_old_text = "".join(lines[q1_start:q1_end])
m2_old_text = "".join(lines[q2_start:q2_end])

def extract_explanations(old_text):
    # This is a bit hacky, but we can use regex to find all explanation fields
    exps = re.findall(r'explanation:\s*`(.*?)`,\n\s*difficulty', old_text, re.DOTALL)
    exp_dict = {}
    for i, exp in enumerate(exps):
        exp_dict[str(i+1)] = exp
    return exp_dict

m1_exps = extract_explanations(m1_old_text)
m2_exps = extract_explanations(m2_old_text)

m1_replacement = get_questions_code(m1_qs, m1_exps, "Unknown")
m2_replacement = get_questions_code(m2_qs, m2_exps, "Hard")

new_lines = lines[:q1_start+1] + [m1_replacement + "\n"] + lines[q1_end:q2_start+1] + [m2_replacement + "\n"] + lines[q2_end:]

with open('src/data/questions.ts', 'w') as f:
    f.writelines(new_lines)

print("Math injection complete!")
