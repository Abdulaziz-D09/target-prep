import json
import re

with open('pdf_extractor/v1_parsed.json', 'r') as f:
    v1_questions = json.load(f)

with open('src/data/questions.ts', 'r') as f:
    ts_content = f.read()

# We need to find Practice Test 1 in questions.ts
# It starts at: title: "Practice Test 1",

pt1_start = ts_content.find('title: "Practice Test 1",')
if pt1_start == -1:
    print("Could not find Practice Test 1")
    exit(1)

# We want to replace the `passage`, `question`, `options`, `answer`, `difficulty` of the first 54 questions
# The `explanation` is already correct.

# A safer way to do this is to parse the `v1_parsed.json`, and replace them one by one.
# Let's find all questions inside Practice Test 1.

def replace_field(content, field_name, new_value, start_idx):
    if field_name == 'options':
        # Options is an array of strings
        val_str = json.dumps(new_value)
        pattern = r'options:\s*\[.*?\]'
        match = re.search(pattern, content[start_idx:], flags=re.DOTALL)
        if match:
            return content[:start_idx + match.start()] + f"options: {val_str}" + content[start_idx + match.end():]
    elif field_name == 'answer':
        pattern = r'answer:\s*\d+'
        match = re.search(pattern, content[start_idx:])
        if match:
            return content[:start_idx + match.start()] + f"answer: {new_value}" + content[start_idx + match.end():]
    else:
        # String fields: passage, question
        val_str = json.dumps(new_value)
        pattern = fr'{field_name}:\s*".*?"'
        match = re.search(pattern, content[start_idx:], flags=re.DOTALL)
        if match:
            return content[:start_idx + match.start()] + f"{field_name}: {val_str}" + content[start_idx + match.end():]
    return content

current_idx = pt1_start
for i in range(54):
    q = v1_questions[i]
    # Find the next id: "..."
    id_match = re.search(r'id:\s*".*?"', ts_content[current_idx:])
    if not id_match:
        print(f"Could not find question {i}")
        break
        
    q_start = current_idx + id_match.start()
    
    ts_content = replace_field(ts_content, 'passage', q['passage'], q_start)
    ts_content = replace_field(ts_content, 'question', q['question'], q_start)
    ts_content = replace_field(ts_content, 'options', q['options'], q_start)
    ts_content = replace_field(ts_content, 'answer', q['answer'], q_start)
    
    current_idx = q_start + len(id_match.group(0))

with open('src/data/questions.ts', 'w') as f:
    f.write(ts_content)

print("Successfully updated the first 54 questions of Practice Test 1 with v1_parsed.json questions.")
