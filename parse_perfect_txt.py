import re
import json

with open("test2_questions.txt", "r") as f:
    text = f.read()

def extract_module(start_marker, end_marker):
    start = text.find(start_marker)
    if end_marker:
        end = text.find(end_marker, start)
    else:
        end = len(text)
    return text[start:end]

m1_r_marker = "Section: Section 1, Module 1: Reading and Writing, Difficulty:"
m2_r_marker = "Section: Section 1, Module 2: Reading and Writing"
m1_m_marker = "Section: Section 2, Module 1: Math"
m2_m_marker = "Section: Section 2, Module 2: Math"

m1_r = extract_module(m1_r_marker, m2_r_marker)
m2_r = extract_module(m2_r_marker, m1_m_marker)
m1_m = extract_module(m1_m_marker, m2_m_marker)
m2_m = extract_module(m2_m_marker, None)

def custom_parse(mod_text, is_math=False):
    questions = []
    # Split by \n1.\n, \n2.\n, etc.
    chunks = re.split(r'\n(\d+)\.\n', "\n" + mod_text)
    
    for i in range(1, len(chunks), 2):
        q_num = int(chunks[i])
        q_content = chunks[i+1].strip()
        
        # separate answer at the bottom
        ans_match = re.search(r'Answer:\s*([A-D]|[\d\.\/\-]+)\s*$', q_content)
        answer = ""
        if ans_match:
            answer = ans_match.group(1)
            q_content = q_content[:ans_match.start()].strip()
            
        # extract options A., B., C., D.
        # Options could have newlines in them, but they start with A., B., C., D.
        opts_match = re.search(r'\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)$', q_content, re.DOTALL)
        options = []
        if opts_match:
            options = [opts_match.group(1).strip(), opts_match.group(2).strip(), opts_match.group(3).strip(), opts_match.group(4).strip()]
            q_content = q_content[:opts_match.start()].strip()
            
        # q_content has passage + question prompt
        if is_math:
            question = q_content
            passage = ""
            if not options:
                # Math SPR
                ans_idx = answer
            else:
                ans_idx = ord(answer) - 65 if answer in ['A','B','C','D'] else answer
            q_type = "Math (SPR)" if not options else "Math"
        else:
            # For reading, find the question prompt
            lines = [x.strip() for x in q_content.split('\n\n') if x.strip()]
            prompt_idx = -1
            for idx, line in enumerate(lines):
                if '?' in line and ("Which choice" in line or "student wants" in line or "Based on the text" in line or "According to" in line or "most likely" in line or "would most logically" in line or "main idea" in line or "As used in the text" in line or "What is the main idea" in line or "Which finding" in line or "Which quotation" in line or "Which statement" in line):
                    prompt_idx = idx
                    break
                    
            if prompt_idx == -1 and len(lines) > 0:
                prompt_idx = 0 if '?' in lines[0] else len(lines) - 1
                
            if len(lines) > 0:
                question = lines[prompt_idx]
                passage = '\n\n'.join(lines[:prompt_idx] + lines[prompt_idx+1:])
            else:
                question = q_content
                passage = ""
                
            ans_idx = ord(answer) - 65 if answer in ['A','B','C','D'] else answer
            q_type = "Reading and Writing"
            
        questions.append({
            "num": q_num,
            "passage": passage,
            "question": question,
            "options": options,
            "answer": ans_idx,
            "type": q_type
        })
    return questions

m1_r_q = custom_parse(m1_r, False)
m2_r_q = custom_parse(m2_r, False)
m1_m_q = custom_parse(m1_m, True)
m2_m_q = custom_parse(m2_m, True)

with open('test2_parsed.json', 'w') as f:
    json.dump([{"questions": m1_r_q}, {"questions": m2_r_q}, {"questions": m1_m_q}, {"questions": m2_m_q}], f, indent=2)

print("Parsed into test2_parsed.json")
