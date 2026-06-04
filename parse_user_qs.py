import re
import json

with open('test1_questions.txt', 'r') as f:
    text = f.read()

# Split the text by "**" (since questions start with **1., **2., etc.)
sections = text.split("###")

for sec in sections:
    if "Section 1, Module 2: Reading and Writing" in sec:
        rw_mod2_text = sec
    elif "Section 2, Module 1: Math" in sec:
        math_mod1_text = sec

def parse_questions(text_chunk):
    questions = []
    # Split by "**[number]."
    parts = re.split(r'\*\*(\d+)\.\*\*', text_chunk)
    # The first part is prologue
    for i in range(1, len(parts), 2):
        q_num = parts[i]
        q_content = parts[i+1]
        
        # Extract Answer
        ans_match = re.search(r'\*\*Answer:\s*(.*?)\*\*', q_content)
        answer_raw = ans_match.group(1).strip() if ans_match else ""
        
        # Remove Answer line from q_content
        q_text = re.sub(r'\*\*Answer:\s*(.*?)\*\*', '', q_content).strip()
        
        # Extract Options (A. B. C. D.)
        options = []
        options_match = list(re.finditer(r'\n([A-D])\.\s(.*?)(?=\n[A-D]\.|$)', q_text, re.DOTALL))
        if options_match:
            for opt in options_match:
                options.append(opt.group(2).strip())
            # The passage/question is everything before the first option
            passage_q = q_text[:options_match[0].start()].strip()
        else:
            passage_q = q_text.strip()
            
        questions.append({
            'num': q_num,
            'passage_q': passage_q,
            'options': options,
            'answer': answer_raw
        })
    return questions

rw_m2 = parse_questions(rw_mod2_text)
math_m1 = parse_questions(math_mod1_text)

print(f"Parsed {len(rw_m2)} questions for RW Module 2")
print(f"Parsed {len(math_m1)} questions for Math Module 1")

with open('rw_m2.json', 'w') as f:
    json.dump(rw_m2, f, indent=2)

with open('math_m1.json', 'w') as f:
    json.dump(math_m1, f, indent=2)
