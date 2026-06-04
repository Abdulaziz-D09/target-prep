import re
import json

with open('math_text.txt', 'r') as f:
    text = f.read()

# Separate Module 1 and Module 2
mod1_start = text.find("Section 2, Module 1: Math")
mod2_start = text.find("Section 2, Module 2: Math")

mod1_text = text[mod1_start:mod2_start] if mod2_start != -1 else text[mod1_start:]
mod2_text = text[mod2_start:] if mod2_start != -1 else ""

def parse_math_questions(mod_text):
    questions = []
    # Match numbering, like "1.", "2.", "(Duplicate numbering from source document):22."
    pattern = r'(?:(?:\(Duplicate numbering from source document\):)?(\d+)\.)'
    parts = re.split(pattern, mod_text)
    
    for i in range(1, len(parts), 2):
        q_num = parts[i]
        content = parts[i+1].strip()
        
        # Extract Answer
        # "Answer: D" or "Answer: 4500"
        ans_match = re.search(r'Answer:\s*(.*?)$', content, re.IGNORECASE)
        answer_raw = ans_match.group(1).strip() if ans_match else ""
        
        # Remove Answer line
        content = re.sub(r'Answer:\s*.*?$', '', content, flags=re.IGNORECASE).strip()
        
        # Check for options A. B. C. D.
        opt_a_match = re.search(r'A\.\s*(.*?)(?=B\.)', content, re.DOTALL)
        opt_b_match = re.search(r'B\.\s*(.*?)(?=C\.)', content, re.DOTALL)
        opt_c_match = re.search(r'C\.\s*(.*?)(?=D\.)', content, re.DOTALL)
        opt_d_match = re.search(r'D\.\s*(.*)$', content, re.DOTALL)
        
        if opt_a_match and opt_b_match and opt_c_match and opt_d_match:
            options = [
                opt_a_match.group(1).strip(),
                opt_b_match.group(1).strip(),
                opt_c_match.group(1).strip(),
                opt_d_match.group(1).strip()
            ]
            question = content[:opt_a_match.start()].strip()
            
            # map A, B, C, D to 0, 1, 2, 3
            ans_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
            ans_val = ans_map.get(answer_raw[0].upper(), 0) if answer_raw else 0
        else:
            options = []
            question = content
            # answer is numeric
            # Extract first number from answer_raw
            num_match = re.search(r'([-\d.]+)', answer_raw)
            if num_match:
                try:
                    ans_val = float(num_match.group(1))
                except:
                    ans_val = 0
            else:
                ans_val = 0
                
        questions.append({
            'num': q_num,
            'question': question,
            'options': options,
            'answer': ans_val
        })
    return questions

m1_qs = parse_math_questions(mod1_text)
m2_qs = parse_math_questions(mod2_text)

print(f"Parsed {len(m1_qs)} Math M1 questions")
print(f"Parsed {len(m2_qs)} Math M2 questions")

with open('math_parsed.json', 'w') as f:
    json.dump({'m1': m1_qs, 'm2': m2_qs}, f, indent=2)
