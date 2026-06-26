import re
import json

def parse_module(text, start_marker, end_marker=None):
    start = text.find(start_marker)
    if start == -1: return []
    end = text.find(end_marker, start) if end_marker else len(text)
    section_text = text[start:end]
    
    questions = []
    
    # We can split on "Answer:" to get each chunk since every question ends with Answer: [A-D] or a number
    parts = section_text.split('\nAnswer:')
    
    for i in range(len(parts) - 1):
        q_chunk = parts[i].strip()
        ans_chunk = parts[i+1].split('\n')[0].strip()
        
        # Strip trailing newlines from q_chunk
        q_chunk = q_chunk.strip()
        
        # If this is not the first question, it likely starts with "N." where N is the question number.
        # But for Q1, it might just start immediately.
        # Try to find if the chunk ends with options A,B,C,D
        
        # Find question number at the beginning or near the end of the previous answer part
        q_num = i + 1
        
        # Clean up the start of the chunk (remove things like "2." or "Section 1...")
        lines = q_chunk.split('\n')
        if re.match(r'^\d+\.', lines[-1].strip()):
            # the number was actually at the end of this chunk
            pass
            
        # Instead, let's just use regex to find options A., B., C., D.
        opt_matches = list(re.finditer(r'\n([A-D])\.\s+', '\n' + q_chunk))
        
        options = []
        passage = ""
        question = ""
        
        # Remove any leading digits + dot like "2."
        q_chunk = re.sub(r'^\s*\d+\.\s*\n*', '', q_chunk).strip()
        
        if 'hard (27 questions)' in q_chunk:
             q_chunk = q_chunk.split('hard (27 questions)')[-1].strip()
        if 'hard (22 questions)' in q_chunk:
             q_chunk = q_chunk.split('hard (22 questions)')[-1].strip()
             
        if len(opt_matches) == 4:
            # We have options A, B, C, D
            opts_start = opt_matches[0].start() - 1
            main_text = q_chunk[:opts_start].strip()
            
            for j in range(4):
                start_idx = opt_matches[j].end() - 1
                end_idx = opt_matches[j+1].start() - 1 if j < 3 else len(q_chunk)
                options.append(q_chunk[start_idx:end_idx].strip())
        else:
            main_text = q_chunk
            
        # Extract passage and question
        lines = main_text.split('\n\n')
        if len(lines) > 1:
            question = lines[-1].strip()
            passage = '\n\n'.join(lines[:-1]).strip()
        else:
            passage = main_text
            question = ""
            
        # Formatting answers
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
print(f"Parsed {len(eng_m2)} English M2 questions")

math_m2 = parse_module(text, "Section 2, Module 2: Math, Difficulty:\n\nhard")
print(f"Parsed {len(math_m2)} Math M2 questions")

with open('parsed_m2.json', 'w') as f:
    json.dump({'eng': eng_m2, 'math': math_m2}, f, indent=2)

