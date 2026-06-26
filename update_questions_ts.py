import json
import re

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

with open('src/data/questions.ts', 'r') as f:
    ts_content = f.read()

def replace_array(var_name, new_questions, ts_content):
    # Prepare the new JSON string
    for q in new_questions:
        prefix = 'reading' if 'english' in var_name else 'math'
        m_str = 'm1' if 'Module1' in var_name else 'm2'
        q['id'] = f"pt2-{prefix}-{m_str}-q{q['num']}"
        if 'difficulty' not in q:
            q['difficulty'] = "Medium"
            
    new_arr_str = json.dumps(new_questions, indent=4)
    replacement = f"const {var_name}: Question[] = {new_arr_str};"
    
    # We will split the file by "const {var_name}: Question[] ="
    # and then find the next top-level "];" or the next "const pt2_" or "export const practiceTests"
    
    parts = ts_content.split(f"const {var_name}: Question[] =")
    if len(parts) < 2:
        print(f"Could not find {var_name}")
        return ts_content
        
    before = parts[0]
    after = parts[1]
    
    # Find the end of the array. It's usually followed by another "const pt2_" or "export const practiceTests"
    next_const = re.search(r'\n(?:const pt2_|export const practiceTests)', after)
    
    if next_const:
        # We need to include everything from next_const.start()
        end_str = after[next_const.start():]
        return before + replacement + end_str
    else:
        print(f"Could not find end of {var_name}")
        return ts_content

ts_content = replace_array('pt2_englishModule1', data[0]['questions'], ts_content)
ts_content = replace_array('pt2_englishModule2', data[1]['questions'], ts_content)
ts_content = replace_array('pt2_mathModule1', data[2]['questions'], ts_content)
ts_content = replace_array('pt2_mathModule2', data[3]['questions'], ts_content)

with open('src/data/questions.ts', 'w') as f:
    f.write(ts_content)

print("Updated src/data/questions.ts!")
