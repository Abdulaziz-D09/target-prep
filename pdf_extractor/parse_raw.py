import re
import json

def parse_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()

    # Split by "Section: Section 1" to get only the English sections
    # Or just find all questions that look like english questions
    # A question starts with "\n1.\n" up to "\nAnswer: [A-D]"
    
    questions = []
    
    # regex to match question block:
    # ^\d+\.\n(.*?)\nA\.(.*?)\nB\.(.*?)\nC\.(.*?)\nD\.(.*?)\nAnswer:\s*([A-D])
    pattern = re.compile(r'^(\d+)\.\n(.*?)\nA\.(.*?)\nB\.(.*?)\nC\.(.*?)\nD\.(.*?)\nAnswer:\s*([A-D])', re.DOTALL | re.MULTILINE)
    
    matches = pattern.finditer(text)
    for m in matches:
        q_num = m.group(1)
        body = m.group(2).strip()
        optA = m.group(3).strip()
        optB = m.group(4).strip()
        optC = m.group(5).strip()
        optD = m.group(6).strip()
        ans = m.group(7).strip()
        
        # We only want English questions, which have a passage usually.
        # Math questions might match this too if they have A. B. C. D.
        # To filter math, we can check if it's within the English section, or just take the first 54 questions (since English is 54).
        
        # Clean up body
        body = re.sub(r'\n+', ' ', body)
        
        # Split body into question and passage. The question usually starts with certain phrases.
        q_phrases = ["Which choice", "As used in the text", "According to the text", "What is the main idea", "Which finding", "Based on the text", "The student wants to"]
        
        question_str = body
        passage_str = ""
        
        for phrase in q_phrases:
            if phrase in body:
                parts = body.split(phrase, 1)
                # Usually passage is BEFORE the question, EXCEPT for vocabulary where it's AFTER the question.
                if len(parts[0].strip()) < 20: # If phrase is at the beginning
                    # Vocab style: Question is at top, passage is below
                    # But wait, in the text, it looks like:
                    # Which choice completes the text with the most logical and precise word or phrase?
                    # A study by Augusta D. Gaspar...
                    question_str = phrase + parts[1]
                    # We need to split at the end of the question sentence. Usually a question mark.
                    q_parts = question_str.split('?', 1)
                    if len(q_parts) > 1:
                        question_str = q_parts[0] + '?'
                        passage_str = q_parts[1].strip()
                else:
                    passage_str = parts[0].strip()
                    question_str = phrase + parts[1]
                break
                
        questions.append({
            "type": "Reading",
            "passage": passage_str.strip() if passage_str else "",
            "question": question_str.strip(),
            "options": [optA, optB, optC, optD],
            "answer": ord(ans) - ord('A'),
            "explanation": "Explanation not provided in raw text.",
            "difficulty": "Medium"
        })
        
    # First 54 questions are English (Module 1: 27, Module 2: 27)
    return questions[:54]

v1_q = parse_file('../V1.txt')
v2_q = parse_file('../V2.txt')
v3_q = parse_file('../V3.txt')

print(f"V1: {len(v1_q)} questions")
print(f"V2: {len(v2_q)} questions")
print(f"V3: {len(v3_q)} questions")

with open('v1_parsed.json', 'w') as f: json.dump(v1_q, f, indent=2)
with open('v2_parsed.json', 'w') as f: json.dump(v2_q, f, indent=2)
with open('v3_parsed.json', 'w') as f: json.dump(v3_q, f, indent=2)
