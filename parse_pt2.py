import re
import json

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Normalize sections
text = re.sub(r'Section: Section 1, Module 1:.*?Difficulty:.*?\n', '###ENG_M1###\n', text, flags=re.IGNORECASE)
text = re.sub(r'Section: Section 1, Module 2:.*?Difficulty:.*?\n', '###ENG_M2###\n', text, flags=re.IGNORECASE)
text = re.sub(r'Section: Section 2, Module 1:.*?Difficulty:.*?\n', '###MATH_M1###\n', text, flags=re.IGNORECASE)
text = re.sub(r'Section: Section 2, Module 2:.*?Difficulty:.*?\n', '###MATH_M2###\n', text, flags=re.IGNORECASE)

parts = text.split('###')
sections = {}
for i in range(1, len(parts)-1, 2):
    sec_name = parts[i]
    sec_text = parts[i+1]
    sections[sec_name] = sec_text

def parse_english(module_text, mod_num):
    qs = []
    if not module_text: return qs
    
    # Clean up common OCR issues in options
    module_text = re.sub(r'\n[Cc]c\.\s+', '\nC. ', module_text)
    module_text = re.sub(r'\nC\s+', '\nC. ', module_text)
    module_text = re.sub(r'\nB\s+', '\nB. ', module_text)
    module_text = re.sub(r'\nA\s+', '\nA. ', module_text)
    module_text = re.sub(r'\nD\s+', '\nD. ', module_text)
    
    # Split by questions: \n1. or \n 1. 
    blocks = re.split(r'\n\s*(\d+)\.\s*\n?', '\n' + module_text.strip())
    
    seq_num = 1
    for i in range(1, len(blocks), 2):
        try:
            num = int(blocks[i])
        except:
            continue
            
        content = blocks[i+1].strip()
        
        # Options format: A. ... B. ... C. ... D. ...
        opt_match = re.search(r'\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)', content, re.DOTALL)
        options = []
        q_text = content
        
        if opt_match:
            options = [opt_match.group(1).strip(), opt_match.group(2).strip(), opt_match.group(3).strip(), opt_match.group(4).strip()]
            q_text = content[:opt_match.start()].strip()
            
        ans_match = re.search(r'\nAnswer:\s*([A-D])', content, flags=re.IGNORECASE)
        ans_val = 0
        if ans_match:
            ans_str = ans_match.group(1).strip().upper()
            ans_val = ord(ans_str) - 65
            if opt_match and ans_match.start() > opt_match.start():
                options[3] = re.sub(r'\nAnswer:\s*[A-D]', '', options[3], flags=re.IGNORECASE).strip()
        
        # English passage vs question splitting
        prompts = [
            "Which choice completes", "As used in the text", "Which choice best describes",
            "Which statement about", "Based on the text", "Based on the texts",
            "Which choice most effectively", "Which choice most logically",
            "The student wants to", "Which quotation from", "Which finding",
            "What does the text most strongly suggest", "According to the text",
            "Which of the following"
        ]
        
        passage = q_text
        question_text = ""
        paragraphs = [p.strip() for p in q_text.split('\n\n') if p.strip()]
        
        for p_idx, p in enumerate(paragraphs):
            is_prompt = False
            for pr in prompts:
                if pr.lower() in p.lower():
                    is_prompt = True
                    break
            if is_prompt:
                question_text = p
                passage = "\n\n".join([x for j, x in enumerate(paragraphs) if j != p_idx])
                break
                
        if not question_text and len(paragraphs) > 1:
            if paragraphs[-1].endswith('?'):
                question_text = paragraphs[-1]
                passage = "\n\n".join(paragraphs[:-1])
                
        if not passage and question_text:
            passage = ""
            
        qs.append({
            "id": f"pt2-reading-m{mod_num}-q{seq_num}",
            "num": seq_num,
            "type": "Reading and Writing",
            "passage": passage,
            "question": question_text if question_text else q_text,
            "options": options,
            "answer": ans_val,
            "difficulty": "Hard" if mod_num == 2 else "Medium"
        })
        seq_num += 1
        
    return qs

def parse_math(module_text, mod_num):
    qs = []
    if not module_text: return qs
    
    # Clean up common OCR issues in options
    module_text = re.sub(r'\n[Cc]c\.\s+', '\nC. ', module_text)
    
    # Split by \n1. or \n 1. 
    blocks = re.split(r'\n\s*(\d+)\.\s*\n?', '\n' + module_text.strip())
    
    seq_num = 1
    for i in range(1, len(blocks), 2):
        content = blocks[i+1].strip()
        
        ans_val = -1
        ans_spr = ""
        ans_match = re.search(r'\nAnswer:\s*([A-D0-9\.\-\/]+)', content, flags=re.IGNORECASE)
        if ans_match:
            ans_str = ans_match.group(1).strip().upper()
            if ans_str in ['A', 'B', 'C', 'D']:
                ans_val = ord(ans_str) - 65
            else:
                ans_spr = ans_str
                
        # For math, options are A. B. C. D.
        opt_match = re.search(r'\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)', content, re.DOTALL)
        options = []
        q_text = content
        q_type = "Math (SPR)" if ans_spr else "Math"
        
        if opt_match:
            options = [opt_match.group(1).strip(), opt_match.group(2).strip(), opt_match.group(3).strip(), opt_match.group(4).strip()]
            q_text = content[:opt_match.start()].strip()
            q_type = "Math"
            if ans_match and ans_match.start() > opt_match.start():
                options[3] = re.sub(r'\nAnswer:\s*[A-D0-9\.\-\/]+', '', options[3], flags=re.IGNORECASE).strip()
        elif ans_val != -1:
            q_type = "Math"
            
        if ans_match and not opt_match:
             q_text = content[:ans_match.start()].strip()
            
        qs.append({
            "id": f"pt2-math-m{mod_num}-q{seq_num}",
            "num": seq_num,
            "type": q_type,
            "question": q_text,
            "options": options,
            "answer": ans_spr if ans_spr else ans_val,
            "difficulty": "Hard" if mod_num == 2 else "Medium"
        })
        seq_num += 1
        
    return qs

eng_m1_text = sections.get('ENG_M1', '')
eng_m2_text = sections.get('ENG_M2', '')
math_m1_text = sections.get('MATH_M1', '')
math_m2_text = sections.get('MATH_M2', '')

eng_qs1 = parse_english(eng_m1_text, 1)
eng_qs2 = parse_english(eng_m2_text, 2)
with open('test2_parsed.json', 'w') as f:
    json.dump([{"questions": eng_qs1}, {"questions": eng_qs2}], f, indent=2)

math_qs1 = parse_math(math_m1_text, 1)
math_qs2 = parse_math(math_m2_text, 2)
with open('test2_math.json', 'w') as f:
    json.dump([{"questions": math_qs1}, {"questions": math_qs2}], f, indent=2)

print("Eng M1:", len(eng_qs1))
print("Eng M2:", len(eng_qs2))
print("Math M1:", len(math_qs1))
print("Math M2:", len(math_qs2))
