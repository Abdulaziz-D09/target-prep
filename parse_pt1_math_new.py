import re
import json

with open('test1_questions.txt', 'r') as f:
    text = f.read()

parts = text.split("### Section 2, Module 1: Math")
math_text = parts[-1]

m1_parts = math_text.split("### Section 2, Module 2: Math")
m1_text = m1_parts[0]
m2_text = m1_parts[1] if len(m1_parts) > 1 else ""

def extract_math(module_text, mod_num):
    qs = []
    
    # Normalize Answer: X
    module_text = re.sub(r'\*\*Answer:\*\*\s*([A-D0-9\.\-\/]+)', r'ANSWER_MARK: \1', module_text, flags=re.IGNORECASE)
    module_text = re.sub(r'Answer:\s*([A-D0-9\.\-\/]+)', r'ANSWER_MARK: \1', module_text, flags=re.IGNORECASE)
    
    blocks = re.split(r'\*\*(\d+)\.\*\*\s*', '\n' + module_text.strip())
    
    seq_num = 1
    for i in range(1, len(blocks), 2):
        content = blocks[i+1].strip()
        
        ans_val = -1
        ans_spr = ""
        ans_match = re.search(r'ANSWER_MARK:\s*([A-D0-9\.\-\/]+)', content)
        if ans_match:
            ans_str = ans_match.group(1).strip().upper()
            if ans_str in ['A', 'B', 'C', 'D']:
                ans_val = ord(ans_str) - 65
            else:
                ans_spr = ans_str
            content = content[:ans_match.start()].strip()
            
        opt_match = re.search(r'\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)', content, re.DOTALL)
        options = []
        q_text = content
        q_type = "Math (SPR)" if ans_spr else "Math"
        
        if opt_match:
            options = [opt_match.group(1).strip(), opt_match.group(2).strip(), opt_match.group(3).strip(), opt_match.group(4).strip()]
            q_text = content[:opt_match.start()].strip()
            q_type = "Math"
        elif ans_val != -1:
            q_type = "Math"
            
        qs.append({
            "id": f"pt1-math-m{mod_num}-q{seq_num}",
            "num": seq_num,
            "type": q_type,
            "question": q_text,
            "options": options,
            "answer": ans_spr if ans_spr else ans_val,
            "difficulty": "Medium" if mod_num == 1 else "Hard"
        })
        seq_num += 1
        
    return qs

qs1 = extract_math(m1_text, 1)
qs2 = extract_math(m2_text, 2)

print("M1 Math qs:", len(qs1))
print("M2 Math qs:", len(qs2))

with open('pt1_math_parsed.json', 'w') as f:
    json.dump([{"questions": qs1}, {"questions": qs2}], f, indent=2)

