import re
import json

def parse_questions():
    with open('test1_questions.txt', 'r') as f:
        q_text = f.read()
    with open('test1_explanations.txt', 'r') as f:
        e_text = f.read()

    # Split into sections
    q_sections = re.split(r'### Section 1, Module ', q_text)
    if len(q_sections) < 3:
        print("Could not find modules in questions text.")
        return
    
    m1_text = q_sections[1]
    m2_text = q_sections[2].split('### Section 2')[0]
    
    e_sections = re.split(r'Section 1, Module ', e_text)
    e_m1_text = e_sections[1]
    e_m2_text = e_sections[2].split('Section 2,')[0]

    def parse_module(text, e_text, prefix):
        questions = []
        # Find all questions like **1. Question prompt**\n Passage \n A. Opt1 \n B. Opt2 \n C. Opt3 \n D. Opt4 \n **Answer: D**
        q_blocks = re.split(r'\n\*\*(\d+)\. ', '\n' + text)
        
        # Parse explanations
        e_blocks = re.split(r'\n(\d+)\n', '\n' + e_text)
        explanations = {}
        for i in range(1, len(e_blocks), 2):
            num = e_blocks[i]
            content = e_blocks[i+1].strip()
            # Extract Core Logic and Why X is Correct
            match = re.search(r'(Core Logic:.*?)(?=\n\d+\n|\Z)', content, re.DOTALL)
            if match:
                explanations[num] = match.group(1).strip()
            else:
                explanations[num] = content
        
        for i in range(1, len(q_blocks), 2):
            num = q_blocks[i]
            content = q_blocks[i+1].strip()
            
            # split prompt from rest
            parts = content.split('**', 1)
            prompt = parts[0].strip()
            rest = parts[1].strip() if len(parts) > 1 else ""
            
            # find answer
            ans_match = re.search(r'\*\*Answer:\s*([A-D])\*\*', rest)
            answer_letter = ans_match.group(1) if ans_match else "A"
            ans_map = {"A": 0, "B": 1, "C": 2, "D": 3}
            answer_idx = ans_map.get(answer_letter, 0)
            
            rest = re.sub(r'\n?\*\*Answer:.*', '', rest).strip()
            
            # find options
            options = []
            opt_match = re.findall(r'\n([A-D])\.\s*(.*)', rest)
            passage = rest
            if opt_match:
                for opt in opt_match:
                    options.append(opt[1].strip())
                # remove options from passage
                passage = re.sub(r'\n[A-D]\.\s*.*', '', passage).strip()
            
            explanation = explanations.get(num, "Detailed explanation currently unavailable.")
            
            q_obj = {
                "id": f"pt1-{prefix}-q{num}",
                "type": "Reading",
                "passage": passage,
                "question": prompt,
                "options": options,
                "answer": answer_idx,
                "explanation": explanation,
                "difficulty": "Unknown"
            }
            questions.append(q_obj)
        return questions

    m1_qs = parse_module(m1_text, e_m1_text, "m1")
    m2_qs = parse_module(m2_text, e_m2_text, "m2")

    with open('pt1_english.json', 'w') as f:
        json.dump({"m1": m1_qs, "m2": m2_qs}, f, indent=4)
    print("Parsed pt1_english.json successfully.")

parse_questions()
