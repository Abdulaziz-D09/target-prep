import re
import json

def parse_module(text, start_marker, end_marker=None):
    start = text.find(start_marker)
    if start == -1: return []
    end = text.find(end_marker, start) if end_marker else len(text)
    section_text = text[start:end]
    
    questions = []
    
    parts = section_text.split('\nAnswer:')
    
    for i in range(len(parts) - 1):
        q_chunk = parts[i].strip()
        if i > 0:
            # The previous answer is at the first line of q_chunk
            q_chunk = '\n'.join(q_chunk.split('\n')[1:]).strip()
            
        ans_chunk = parts[i+1].split('\n')[0].strip()
        
        q_chunk = q_chunk.strip()
        q_num = i + 1
        
        q_chunk = re.sub(r'^\s*\d+\.\s*\n*', '', q_chunk).strip()
        
        if 'hard (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('hard (27 questions)')[-1].strip()
        if 'hard (22' in q_chunk:
             q_chunk = q_chunk.split('questions)')[-1].strip()
             
        opt_matches = list(re.finditer(r'(?:^|\n)\s*([A-D])\.\s+', q_chunk))
        
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
                # Remove any stray newlines within options that might break things visually or structurally
                # options.append(opt_text.replace('\n', ' '))
                options.append(opt_text)
        else:
            main_text = q_chunk
            
        if "Math" in start_marker:
            question = main_text
            passage = ""
        else:
            # Fix OCR broken paragraphs: \n\n followed by lowercase letter
            main_text = re.sub(r'\n\n([a-z])', r' \1', main_text)
            # Fix blanks: ' :' -> ' ______:'
            main_text = re.sub(r'\s+:', ' ______:', main_text)
            
            lines = [line.strip() for line in main_text.split('\n\n') if line.strip()]
            
            if len(lines) > 1:
                # If the first block contains the question mark, it's the question
                if '?' in lines[0] and '?' not in lines[-1]:
                    question = lines[0]
                    passage = '\n\n'.join(lines[1:])
                # Otherwise, assume the last block is the question
                else:
                    question = lines[-1]
                    passage = '\n\n'.join(lines[:-1])
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

with open("test2_questions.txt", "r") as f:
    text = f.read()
    
eng_m2 = parse_module(text, "Section 1, Module 2: Reading and Writing, Difficulty:\n\nhard", "Section 2, Module 1: Math")
math_m2 = parse_module(text, "Section: Section 2, Module 2: Math, Difficulty: hard (22")

for q in eng_m2:
    if len(q['options']) == 0:
        print(f"Warning: English M2 Q{q['num']} has 0 options!")

def format_ts_questions(questions, mod_type, start_id):
    lines = []
    lines.append("[\n")
    for i, q in enumerate(questions):
        q_type = "Reading and Writing" if mod_type == "reading" else ("Math" if len(q['options']) > 0 else "Math (SPR)")
        lines.append("    {\n")
        lines.append(f'        "id": "pt2-{mod_type}-m2-q{q["num"]}",\n')
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
            
        lines.append(f'        "difficulty": "Hard"\n')
        lines.append("    }" + ("," if i < len(questions) - 1 else "") + "\n")
    lines.append("];\n")
    return "".join(lines)

eng_ts = "const pt2_englishModule2: Question[] = " + format_ts_questions(eng_m2, "reading", 1)
math_ts = "const pt2_mathModule2: Question[] = " + format_ts_questions(math_m2, "math", 1)

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

# Replace english module 2
eng_start = content.find("const pt2_englishModule2: Question[] = [")
eng_end = content.find("const pt2_mathModule1: Question[] = [")
content = content[:eng_start] + eng_ts + "\n" + content[eng_end:]

# Replace math module 2
math_start = content.find("const pt2_mathModule2: Question[] = [")
math_end = content.find("];\n", math_start) + 3
content = content[:math_start] + math_ts + content[math_end:]

with open('src/data/questions.ts', 'w') as f:
    f.write(content)
    
print(f"Re-injected properly! {len(eng_m2)} eng, {len(math_m2)} math.")
