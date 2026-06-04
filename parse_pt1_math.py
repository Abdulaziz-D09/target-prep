import re
import json

with open('math_text.txt', 'r') as f:
    text = f.read()

modules = re.split(r'Section 2, Module \d+.*?\(\d+ questions\)', text)
if len(modules) < 3:
    modules = re.split(r'Module \d+:', text)

m1_text = modules[1]
m2_text = modules[2]

def parse_math_module(m_text, mod_num):
    qs = []
    
    # We will find the boundaries for each question 1..22 (or duplicate 22)
    # They look like "1.Text...", "2.Text..."
    # A safe way is to split by `(\d+)\.` but only when it makes sense (increasing order).
    # Since it's exactly 1 to 22, let's find them sequentially.
    
    q_texts = []
    current_pos = 0
    for i in range(1, 23):
        # find "i."
        # to avoid matching inside a math equation, we can look for it right after "Answer: [A-D\d]+" or at the very beginning.
        # But wait, there are duplicate 22s!
        pass

    # Better: split using regex that looks for Answer: X followed immediately by \d+\.
    # Like: Answer: D2.
    # Replace "Answer: D2." with "Answer: D\n2."
    m_text = re.sub(r'(Answer:\s*(?:[A-D]|\d+(?:\.\d+)?))(?=\d+\.)', r'\1\n', m_text)
    m_text = re.sub(r'(\(Duplicate numbering from source document\):\d+\.)', r'\n\1', m_text)
    
    # For the very first question:
    m_text = re.sub(r'^(1\.)', r'\n\1', m_text)
    
    blocks = m_text.strip().split('\n')
    
    for b in blocks:
        b = b.strip()
        if not b: continue
        
        m = re.match(r'^(\d+)\.(.*)', b)
        if not m:
            m = re.match(r'^\(Duplicate.*?\):(\d+)\.(.*)', b)
            if not m:
                continue
        num = int(m.group(1))
        content = m.group(2).strip()
        
        ans = -1
        ans_match = re.search(r'Answer:\s*([A-D]|\d+(?:\.\d+)?)', content)
        if ans_match:
            ans_val = ans_match.group(1)
            if ans_val in ['A', 'B', 'C', 'D']:
                ans = ord(ans_val) - 65
            else:
                ans = ans_val
            content = content[:ans_match.start()].strip()
            
        opt_match = re.search(r'A\.\s*(.*?)B\.\s*(.*?)C\.\s*(.*?)D\.\s*(.*)', content)
        options = []
        q_text = content
        if opt_match:
            options = [opt_match.group(1).strip(), opt_match.group(2).strip(), opt_match.group(3).strip(), opt_match.group(4).strip()]
            q_text = content[:opt_match.start()].strip()
            
        qs.append({
            "id": f"pt1-m{mod_num+2}-q{num}",
            "num": num,
            "type": "Math",
            "question": q_text,
            "options": options,
            "answer": ans,
            "difficulty": "Medium" if mod_num == 1 else "Hard"
        })
    return qs

qs1 = parse_math_module(m1_text, 1)
qs2 = parse_math_module(m2_text, 2)

print("Module 1 len:", len(qs1))
print("Module 2 len:", len(qs2))

with open('test1_explanations.txt', 'r') as f:
    exp_text = f.read()

def parse_expl(text):
    parts = re.split(r'\nQuestion (\d+) \u2014 Answer:', '\n' + text)
    exps = {}
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        content = parts[i+1].strip()
        exps[num] = content
    return exps

m_parts = re.split(r'MODULE \d+ \(\d+ Questions\)', exp_text)
if len(m_parts) >= 3:
    e1 = parse_expl(m_parts[1])
    e2 = parse_expl(m_parts[2])
    for q in qs1:
        q['explanation'] = e1.get(q['num'], "")
    for q in qs2:
        q['explanation'] = e2.get(q['num'], "")

with open('pt1_math_parsed.json', 'w') as f:
    json.dump([{"questions": qs1}, {"questions": qs2}], f, indent=2)
