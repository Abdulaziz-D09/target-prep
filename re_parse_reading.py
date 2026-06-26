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
m2_r_marker = "Section: Section 1, Module 2: Reading and Writing, Difficulty:"
m1_m_marker = "Section: Section 2, Module 1: Math, Difficulty: unknown (22"
    
m1_text = extract_module(m1_r_marker, m2_r_marker)
m2_text = extract_module(m2_r_marker, m1_m_marker)

def custom_parse(mod_text):
    questions = []
    # Split by number dot
    chunks = re.split(r'\n(\d+)\.\n', "\n" + mod_text)
    
    # chunks[0] is preamble, then chunks[1] is num, chunks[2] is content...
    for i in range(1, len(chunks), 2):
        q_num = int(chunks[i])
        q_content = chunks[i+1].strip()
        
        # separate answer at the bottom
        ans_match = re.search(r'Answer:\s*([A-D])\s*$', q_content)
        answer = ""
        if ans_match:
            answer = ans_match.group(1)
            q_content = q_content[:ans_match.start()].strip()
            
        # extract options A., B., C., D.
        # we can use a regex that matches A. text B. text C. text D. text at the end
        opts_match = re.search(r'\nA\.\s*(.*?)\nB\.\s*(.*?)\nC\.\s*(.*?)\nD\.\s*(.*)$', q_content, re.DOTALL)
        options = []
        if opts_match:
            options = [opts_match.group(1).strip(), opts_match.group(2).strip(), opts_match.group(3).strip(), opts_match.group(4).strip()]
            q_content = q_content[:opts_match.start()].strip()
            
        # Now q_content has passage + question prompt
        # the question prompt is usually just 1 sentence, and we want it in `question`.
        # the passage is the rest, in `passage`.
        # But where is the question prompt? Usually it's either before or after the passage!
        # Actually, let's look at the text. 
        # Often it's:
        # Which choice completes the text...
        # [passage]
        # OR
        # [passage]
        # Which choice completes the text...
        
        # Let's split by double newline and find the line that looks like a question prompt.
        lines = [x.strip() for x in q_content.split('\n\n') if x.strip()]
        
        prompt_idx = -1
        for idx, line in enumerate(lines):
            if '?' in line and ("Which choice" in line or "student wants" in line or "Based on the text" in line or "According to" in line or "most likely" in line or "would most logically" in line or "main idea" in line or "As used in the text" in line or "What is the main idea" in line):
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
            
        ans_idx = -1
        if answer in ['A', 'B', 'C', 'D']:
            ans_idx = ord(answer) - 65
            
        questions.append({
            "num": q_num,
            "passage": passage,
            "question": question,
            "options": options,
            "answer": ans_idx,
            "type": "Reading and Writing"
        })
    return questions

m1_q = custom_parse(m1_text)
m2_q = custom_parse(m2_text)

# Let's write a small diagnostic file to see the results
with open('reading_test.json', 'w') as f:
    json.dump([{"questions": m1_q}, {"questions": m2_q}], f, indent=2)

print("Parsed into reading_test.json")
