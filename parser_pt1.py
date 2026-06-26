import re
import json

def parse_module(text, start_marker, end_marker=None):
    if not start_marker in text:
        return []
    
    start_idx = text.find(start_marker)
    if end_marker and end_marker in text:
        end_idx = text.find(end_marker)
        chunk = text[start_idx:end_idx]
    else:
        chunk = text[start_idx:]
        
    parts = re.split(r'(\n)(?=\d+\.\s*|\*\*\d+\.\*\*\s*)', '\n' + chunk)
    
    questions = []
    
    for i in range(1, len(parts), 2):
        if i+1 >= len(parts):
            break
            
        q_chunk = parts[i] + parts[i+1]
        
        # answer block is sometimes at the end
        ans_chunk = "A"
        ans_match = re.search(r'Answer:\s*([A-D]|-?[\d./]+)', q_chunk, re.IGNORECASE)
        if ans_match:
            ans_chunk = ans_match.group(1).upper()
            q_chunk = q_chunk[:ans_match.start()].strip()
            # If there's a trailing "---", remove it
            q_chunk = re.sub(r'---$', '', q_chunk).strip()
            
        q_chunk = q_chunk.strip()
        q_num = (i - 1) // 2 + 1
        
        q_chunk = re.sub(r'^\s*\**\d+\.\s*\**\n*', '', q_chunk).strip()
             
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
            
        if "Math" in start_marker:
            question = main_text
            passage = ""
            def format_math(text_str):
                text_str = re.sub(r'(?<!\d)(\d+)/(\d+)', r'$\frac{\1}{\2}$', text_str)
                return text_str
            question = format_math(re.sub(r'^\s*\d+\.\s*\n*', '', question).strip())
            options = [format_math(opt) for opt in options]
        else:
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
                
                question = re.sub(r'^\s*\d+\.\s*\n*', '', lines[prompt_idx]).strip()
                passage = '\n\n'.join(lines[:prompt_idx] + lines[prompt_idx+1:])
            else:
                passage = main_text
                question = ""
            
        image = ""
        image_pattern = re.compile(r'__IMAGE__[^\n]*\n!\[.*?\]\((.*?)\)\n__ENDIMAGE__', re.DOTALL)
        def extract_image(text_block):
            m = image_pattern.search(text_block)
            if m:
                img_path = m.group(1)
                cleaned = image_pattern.sub('', text_block).strip()
                return cleaned, img_path
            return text_block, ""
        
        passage, img = extract_image(passage)
        if not img:
            question, img = extract_image(question)
        image = img
            
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
        if image:
            q_obj["image"] = image
        questions.append(q_obj)
        
    return questions

with open("test1_questions.txt", "r") as f:
    text = f.read()

m1_r_marker = "Section: Section 1, Module 1: Reading and Writing, Difficulty:"
m2_r_marker = "Section: Section 1, Module 2: Reading and Writing, Difficulty:"
m1_m_marker = "### Section 2, Module 1: Math"
m2_m_marker = "### Section 2, Module 2: Math"
    
eng_m1 = parse_module(text, m1_r_marker, m2_r_marker)
eng_m2 = parse_module(text, m2_r_marker, m1_m_marker)
math_m1 = parse_module(text, m1_m_marker, m2_m_marker)
math_m2 = parse_module(text, m2_m_marker)

print(f"Parsed: EngM1={len(eng_m1)}, EngM2={len(eng_m2)}, MathM1={len(math_m1)}, MathM2={len(math_m2)}")

with open('test1_explanations.txt', 'r') as f:
    exp_text = f.read()

def parse_expl_modules(text):
    m1_r = text.find("Section 1, Module 1: Reading & Writing")
    m2_r = text.find("Section 1, Module 2: Reading & Writing")
    m1_m = text.find("Section 2, Module 1: Math")
    m2_m = text.find("Section 2, Module 2: Math")
    
    parts = [
        text[m1_r:m2_r] if m1_r != -1 else "",
        text[m2_r:m1_m] if m2_r != -1 else "",
        text[m1_m:m2_m] if m1_m != -1 else "",
        text[m2_m:] if m2_m != -1 else ""
    ]
    
    modules_exps = []
    for p in parts:
        exps = {}
        chunks = re.split(r'\n^(\d+)$\n', '\n' + p, flags=re.MULTILINE)
        for i in range(1, len(chunks), 2):
            num = int(chunks[i])
            exps[num] = chunks[i+1].strip()
        modules_exps.append(exps)
    return modules_exps

expl_modules = parse_expl_modules(exp_text)

for q in eng_m1: q['explanation'] = expl_modules[0].get(q['num'], "")
for q in eng_m2: q['explanation'] = expl_modules[1].get(q['num'], "")
for q in math_m1: q['explanation'] = expl_modules[2].get(q['num'], "")
for q in math_m2: q['explanation'] = expl_modules[3].get(q['num'], "")

def format_ts_questions(questions, mod_type, module_num):
    lines = []
    lines.append("[\n")
    for i, q in enumerate(questions):
        q_type = "Reading and Writing" if mod_type == "reading" else ("Math" if len(q['options']) > 0 else "Math (SPR)")
        diff = "Hard" if module_num == 2 else "Medium"
        lines.append("    {\n")
        lines.append(f'        "id": "pt1-{mod_type}-m{module_num}-q{q["num"]}",\n')
        lines.append(f'        "num": {q["num"]},\n')
        lines.append(f'        "type": "{q_type}",\n')
        if q['passage']:
            lines.append(f'        "passage": {json.dumps(q["passage"])},\n')
        if q.get('image'):
            lines.append(f'        "image": {json.dumps(q["image"])},\n')
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
            
        lines.append(f'        "difficulty": "{diff}",\n')
        if 'explanation' in q and q['explanation']:
            lines.append(f'        "explanation": {json.dumps(q["explanation"])}\n')
        else:
            lines.append(f'        "explanation": ""\n')
        lines.append("    }" + ("," if i < len(questions) - 1 else "") + "\n")
    lines.append("];\n")
    return "".join(lines)

eng_m1_ts = "const pt1_englishModule1: Question[] = " + format_ts_questions(eng_m1, "reading", 1)
eng_m2_ts = "const pt1_englishModule2: Question[] = " + format_ts_questions(eng_m2, "reading", 2)
math_m1_ts = "const pt1_mathModule1: Question[] = " + format_ts_questions(math_m1, "math", 1)
math_m2_ts = "const pt1_mathModule2: Question[] = " + format_ts_questions(math_m2, "math", 2)

with open('src/data/questions.ts', 'r') as f:
    content = f.read()

def replace_block(content, var_name, new_val, next_var):
    start = content.find(f"const {var_name}: Question[] = [")
    if start == -1: return content
    if next_var:
        if "export" in next_var:
            end = content.find(next_var)
        else:
            end = content.find(f"const {next_var}: Question[] = [")
        if end == -1: return content
    else:
        end = content.find("];\n", start) + 3
    return content[:start] + new_val + "\n\n" + content[end:]

content = replace_block(content, "pt1_englishModule1", eng_m1_ts, "pt1_englishModule2")
content = replace_block(content, "pt1_englishModule2", eng_m2_ts, "pt1_mathModule1")
content = replace_block(content, "pt1_mathModule1", math_m1_ts, "pt1_mathModule2")
content = replace_block(content, "pt1_mathModule2", math_m2_ts, "pt2_englishModule1")

with open('src/data/questions.ts', 'w') as f:
    f.write(content)
    
print("Re-injected ALL 4 modules for pt1 successfully!")
