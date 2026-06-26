import json
import re

with open("test2_questions.txt", "r") as f:
    text = f.read()

def parse_module(text, start_marker, end_marker=None):
    if end_marker:
        module_text = text.split(start_marker)[1].split(end_marker)[0]
    else:
        module_text = text.split(start_marker)[1]
        
    parts = re.split(r'\nAnswer:\s*', module_text)
    
    questions = []
    
    for i in range(len(parts) - 1):
        q_chunk = parts[i]
        
        if i > 0:
            q_chunk = '\n'.join(q_chunk.split('\n')[1:]).strip()
            
        ans_chunk = parts[i+1].split('\n')[0].strip()
        q_chunk = q_chunk.strip()
        q_num = i + 1
        
        
        
        if 'hard (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('hard (27 questions)')[-1].strip()
        if 'unknown (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('unknown (27 questions)')[-1].strip()
        if 'questions)' in q_chunk and 'Section' in q_chunk:
             q_chunk = q_chunk.split('questions)')[-1].strip()
        q_chunk = re.sub(r'^\s*\d+\.\s*\n*', '', q_chunk).strip()
             
        opt_matches = list(re.finditer(r'(?:^|\n)\s*([A-D])\.\s*', q_chunk))
        
        abcd_matches = []
        for match in reversed(opt_matches):
            abcd_matches.append(match)
            if match.group(1) == 'A' and len(abcd_matches) >= 4:
                break
                
        abcd_matches.reverse()
        if len(abcd_matches) >= 4 and [m.group(1) for m in abcd_matches[-4:]] == ['A', 'B', 'C', 'D']:
            opt_matches = abcd_matches[-4:]
        else:
            opt_matches = []
            
        options = []
        passage = ""
        question = ""
        
        if len(opt_matches) == 4:
            opts_start = opt_matches[0].start()
            main_text = q_chunk[:opts_start].strip()
            for j in range(4):
                start_idx = opt_matches[j].end()
                end_idx = opt_matches[j+1].start() if j < 3 else len(q_chunk)
                opt_text = q_chunk[start_idx:end_idx].strip()
                options.append(opt_text)
        else:
            main_text = q_chunk
            
        main_text = re.sub(r'\n\n([a-z])', r' \1', main_text)
        main_text = re.sub(r'\s+:', ' ______:', main_text)
        
        lines = [line.strip() for line in main_text.split('\n\n') if line.strip()]
        
        if len(lines) > 1:
            prompt_idx = -1
            for idx, line in enumerate(lines):
                if '?' in line and ("Which choice" in line or "student wants" in line or "Based on the text" in line or "According to" in line or "most likely" in line or "would most logically" in line or "main idea" in line or len(line) < 200):
                    prompt_idx = idx
                    break
            
            if prompt_idx == -1:
                prompt_idx = 0 if '?' in lines[0] else len(lines) - 1
            
            question = re.sub(r'^\d+\.\s*\n*', '', lines[prompt_idx]).strip()
            passage = '\n\n'.join(lines[:prompt_idx] + lines[prompt_idx+1:])
        else:
            passage = main_text
            question = ""
            
        ans_idx = -1
        if ans_chunk in ['A', 'B', 'C', 'D']:
            ans_idx = ord(ans_chunk) - 65
            
        q_obj = {
            "num": q_num,
            "passage": passage,
            "question": question,
            "options": options,
            "answer": ans_idx if ans_idx != -1 else ans_chunk
        }
        questions.append(q_obj)
        
    return questions

m1_r_marker = "Section: Section 1, Module 1: Reading and Writing, Difficulty:"
m2_r_marker = "Section: Section 1, Module 2: Reading and Writing, Difficulty:"
m1_m_marker = "Section: Section 2, Module 1: Math, Difficulty: unknown (22"
    
eng_m2 = parse_module(text, m2_r_marker, m1_m_marker)

print(f"Parsed EngM2: {len(eng_m2)}")

def format_ts_questions(questions, mod_type, module_num):
    lines = []
    lines.append("[\n")
    for i, q in enumerate(questions):
        q_type = "Reading and Writing" if mod_type == "reading" else ("Math" if len(q['options']) > 0 else "Math (SPR)")
        diff = "Hard" if module_num == 2 else "Medium"
        lines.append("    {\n")
        lines.append(f'        "id": "pt2-{mod_type}-m{module_num}-q{q["num"]}",\n')
        lines.append(f'        "num": {q["num"]},\n')
        lines.append(f'        "type": "{q_type}",\n')
        if q['passage']:
            lines.append(f'        "passage": {json.dumps(q["passage"])},\n')
        if q['question']:
            lines.append(f'        "question": {json.dumps(q["question"])},\n')
        if 'options' in q and len(q['options']) > 0:
            lines.append(f'        "options": {json.dumps(q["options"], indent=12).replace("]","        ]")},\n')
        else:
            lines.append(f'        "options": [],\n')
        
        ans = q['answer']
        if isinstance(ans, int):
            lines.append(f'        "answer": {ans},\n')
        else:
            lines.append(f'        "answer": "{ans}",\n')
            
        lines.append(f'        "difficulty": "{diff}"\n')
        lines.append("    }" + ("," if i < len(questions) - 1 else "") + "\n")
    lines.append("];\n")
    return "".join(lines)

eng_m2_ts = "const pt2_englishModule2: Question[] = " + format_ts_questions(eng_m2, "reading", 2)

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

def replace_block(content, var_name, new_val, next_var):
    start = content.find(f"const {var_name}: Question[] = [")
    if next_var:
        end = content.find(f"const {next_var}: Question[] = [")
    else:
        end = content.find("];\n", start) + 3
    return content[:start] + new_val + ("\n" if next_var else "") + content[end:]

content = replace_block(content, "pt2_englishModule2", eng_m2_ts, "pt2_mathModule1")

with open('src/data/questions.ts', 'w') as f:
    f.write(content)
    
print("Updated pt2_englishModule2 in questions.ts")
