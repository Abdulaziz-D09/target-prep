import re
import json

with open('module2_text.txt', 'r') as f:
    text = f.read()

# Pattern to extract individual questions
# Each question starts with "1.", "2.", up to "27."
# We can split by this pattern: r'(?:\n|^)(\d+)\.\s' or just find all matches.

# Since it's all on one line per question, let's just find them by iterating lines
lines = text.split('\n')
questions = []

for line in lines:
    match = re.match(r'^(\d+)\.\s*(.*)', line.strip())
    if match:
        q_num = match.group(1)
        content = match.group(2)
        
        # Extract Answer
        ans_match = re.search(r'Answer:\s*([A-D])', content)
        answer_letter = ans_match.group(1) if ans_match else ""
        
        # Remove answer from content
        content = re.sub(r'Answer:\s*[A-D].*$', '', content).strip()
        
        # Extract options
        # They look like: "A. textB. textC. textD. text"
        opt_a_match = re.search(r'A\.\s*(.*?)(?=B\.)', content)
        opt_b_match = re.search(r'B\.\s*(.*?)(?=C\.)', content)
        opt_c_match = re.search(r'C\.\s*(.*?)(?=D\.)', content)
        opt_d_match = re.search(r'D\.\s*(.*)$', content)
        
        if opt_a_match and opt_b_match and opt_c_match and opt_d_match:
            options = [
                opt_a_match.group(1).strip(),
                opt_b_match.group(1).strip(),
                opt_c_match.group(1).strip(),
                opt_d_match.group(1).strip()
            ]
            # Passage + Question is everything before A.
            passage_q = content[:opt_a_match.start()].strip()
        else:
            options = []
            passage_q = content
            
        questions.append({
            'num': q_num,
            'passage_q': passage_q,
            'options': options,
            'answer': answer_letter
        })

print(f"Parsed {len(questions)} questions")
with open('module2_parsed.json', 'w') as f:
    json.dump(questions, f, indent=2)
