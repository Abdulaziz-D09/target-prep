import re
import json

def parse_module(text, start_marker, end_marker=None):
    start = text.find(start_marker)
    if start == -1: return []
    end = text.find(end_marker, start) if end_marker else len(text)
    section_text = text[start:end]
    
    questions = []
    # Split by "Number." 
    # The format is typically: "\n1.\nQuestion text... A. ... B. ... C. ... D. ... \nAnswer: X"
    
    # We can split on "\n[0-9]+.\n" or similar
    pattern = re.compile(r'\n(\d+)\.\s*\n', re.DOTALL)
    parts = pattern.split('\n' + section_text)
    
    for i in range(1, len(parts), 2):
        q_num = int(parts[i])
        q_content = parts[i+1]
        
        # Extract Answer
        ans_match = re.search(r'\nAnswer:\s*([A-D]|[\d\.\-\/]+)', q_content)
        if not ans_match:
            continue
        
        ans_text = ans_match.group(1).strip()
        ans_idx = -1
        if ans_text in ['A', 'B', 'C', 'D']:
            ans_idx = ord(ans_text) - 65
            
        # Remove Answer from content
        q_content = q_content[:ans_match.start()].strip()
        
        # Check if it has options
        opt_matches = list(re.finditer(r'\n([A-D])\.\s+', '\n' + q_content))
        
        options = []
        passage = ""
        question = ""
        
        if len(opt_matches) == 4:
            # We have options A, B, C, D
            opts_start = opt_matches[0].start() - 1
            main_text = q_content[:opts_start].strip()
            
            for j in range(4):
                start_idx = opt_matches[j].end() - 1
                end_idx = opt_matches[j+1].start() - 1 if j < 3 else len(q_content)
                options.append(q_content[start_idx:end_idx].strip())
        else:
            main_text = q_content
            
        # Split main text into passage and question. Usually the last sentence ending with "?" or similar is the question.
        # But for SAT, usually there's a big paragraph, then a question like "Which choice..."
        
        # Find the last paragraph or sentence ending in ?
        lines = main_text.split('\n\n')
        if len(lines) > 1:
            question = lines[-1].strip()
            passage = '\n\n'.join(lines[:-1]).strip()
            if not question.endswith('?') and '?' in main_text:
                # Fallback: split by last '?'
                q_start = main_text.rfind('\n', 0, main_text.rfind('?'))
                if q_start != -1:
                    passage = main_text[:q_start].strip()
                    question = main_text[q_start:].strip()
        else:
            passage = main_text
            question = "What is the answer?" # Fallback
            
        q_obj = {
            "num": q_num,
            "passage": passage,
            "question": question,
            "options": options,
            "answer": ans_idx if ans_idx != -1 else ans_text
        }
        questions.append(q_obj)
        
    return questions

with open("test2_questions.txt", "r") as f:
    text = f.read()
    
# Extract English M2
eng_m2 = parse_module(text, "Section 1, Module 2: Reading and Writing, Difficulty:\n\nhard", "Section 2, Module 1: Math")
print(f"Parsed {len(eng_m2)} English M2 questions")

# Extract Math M2
math_m2 = parse_module(text, "Section 2, Module 2: Math, Difficulty:\n\nhard")
print(f"Parsed {len(math_m2)} Math M2 questions")

# Save as JSON for inspection
with open('parsed_m2.json', 'w') as f:
    json.dump({'eng': eng_m2, 'math': math_m2}, f, indent=2)

