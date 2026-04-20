import json
import re

def clean_text(text):
    # PDF extraction sometimes adds spaces inside words (e.g. "r epor ted", "micr oorganisms", "Corr ect A nswer")
    # This is a very rough heuristic: if a single character is isolated inside a word, we might have issues,
    # but let's just do a basic whitespace cleanup.
    text = text.replace('\n', ' ')
    text = re.sub(r' +', ' ', text)
    # Fix common PDF extraction spacing issues (heuristic)
    # Examples: "f ewer" -> "fewer", "r epor ted" -> "reported", "v ariations" -> "variations"
    # Actually, fixing it automatically via regex might be risky. Let's just do basic cleanup.
    return text.strip()

with open('extracted.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

questions = []
current_question = {}
state = "SEARCHING"

for i, line in enumerate(lines):
    line = line.strip()
    if not line:
        continue
    
    if line.startswith("Question ID "):
        if current_question and 'rationale' in current_question:
            questions.append(current_question)
        current_question = {'id': line.replace("Question ID ", "").strip(), 'options': [], 'passage': [], 'rationale': []}
        state = "PASSAGE"
        continue
        
    if state == "PASSAGE":
        if line.startswith("ID: "):
            continue
        if re.match(r'^[A-D]\.', line):
            state = "OPTIONS"
            current_question['options'].append(line)
        elif "Which choice " in line or "?" in line or "Based on the text," in line:
            current_question['question'] = line
            state = "QUESTION"
        else:
            current_question['passage'].append(line)
            
    elif state == "QUESTION":
        if re.match(r'^[A-D]\.', line):
            state = "OPTIONS"
            current_question['options'].append(line)
        elif line.startswith("A.") or line.startswith("B.") or line.startswith("C.") or line.startswith("D."):
             state = "OPTIONS"
             current_question['options'].append(line)
        else:
            # might still be question or passage
            if 'question' in current_question:
                current_question['question'] += " " + line
            else:
                current_question['question'] = line
            
    elif state == "OPTIONS":
        if line.startswith("ID: ") and "Answer" in line:
            state = "ANSWER_START"
        elif re.match(r'^[A-D]\.', line):
            current_question['options'].append(line)
        else:
            if current_question['options']:
                current_question['options'][-1] += " " + line
                
    elif state == "ANSWER_START":
        if "Correct Answer" in line.replace(" ", "") or "Correct A nswer" in line:
            pass
        elif line in ["A", "B", "C", "D"]:
            current_question['answer'] = line
        elif line == "Rationale":
            state = "RATIONALE"
            
    elif state == "RATIONALE":
        if line == "Question Diﬃculty:" or line == "Question Difficulty:":
            state = "DIFFICULTY"
        elif "Assessment" in line or "SATTest" in line:
            pass # ignore footer
        elif "Reading and W ritingDomain" in line or "Information and" in line or "IdeasSkill" in line or "DetailsDiﬃculty" in line:
             pass
        else:
            current_question['rationale'].append(line)
            
    elif state == "DIFFICULTY":
        if line in ["Easy", "Medium", "Hard"]:
            current_question['difficulty'] = line
            state = "SEARCHING"

if current_question and 'rationale' in current_question:
    questions.append(current_question)

# Format the parsed questions
formatted_questions = []
for q in questions:
    passage = clean_text(" ".join(q.get('passage', [])))
    question_text = clean_text(q.get('question', ''))
    
    # Extract options
    opts = []
    for opt in q.get('options', []):
        opt_text = re.sub(r'^[A-D]\.\s*', '', opt)
        opts.append(clean_text(opt_text))
        
    ans_letter = q.get('answer', 'A')
    ans_index = ord(ans_letter) - ord('A')
    
    rationale = clean_text(" ".join(q.get('rationale', [])))
    difficulty = q.get('difficulty', 'Medium')
    
    item = {
        "id": q['id'],
        "type": "Reading",
        "passage": passage,
        "question": question_text,
        "options": opts,
        "answer": ans_index,
        "explanation": rationale,
        "difficulty": difficulty
    }
    formatted_questions.append(item)

print(f"Parsed {len(formatted_questions)} questions")
with open('parsed_questions.json', 'w', encoding='utf-8') as f:
    json.dump(formatted_questions, f, indent=2)
