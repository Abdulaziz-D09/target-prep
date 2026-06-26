import json
import re

with open('src/data/questions.ts', 'r') as f:
    ts_content = f.read()

def wrap_math(opt):
    opt = opt.strip()
    if not opt:
        return opt
    if opt.startswith('$') and opt.endswith('$'):
        return opt
    if opt.startswith('$$') and opt.endswith('$$'):
        return opt
    # check if it's math (contains math operators, numbers, and not a full sentence)
    # A simple check: if no word longer than 4 chars or has math symbols
    if not re.search(r'[a-zA-Z]{5,}', opt) or '^' in opt or '\\frac' in opt or '\\sqrt' in opt or '=' in opt:
        return f"${opt}$"
    return opt

def process_array(var_name, content):
    parts = content.split(f"const {var_name}: Question[] = ")
    if len(parts) < 2:
        return content
    
    before = parts[0]
    after = parts[1]
    
    # find the end of the array, which is ];
    end_idx = after.find('];\n')
    if end_idx == -1:
        end_idx = after.find('];\r\n')
    
    arr_str = after[:end_idx+1]
    rest = after[end_idx+2:]
    
    # parse the array (we have to replace some JS things if it's not valid JSON, but questions.ts arrays are valid JSON)
    try:
        arr = json.loads(arr_str)
        for q in arr:
            if 'options' in q and q['options']:
                q['options'] = [wrap_math(o) for o in q['options']]
        new_arr_str = json.dumps(arr, indent=4)
        return before + f"const {var_name}: Question[] = " + new_arr_str + ";\n" + rest
    except Exception as e:
        print(f"Failed to parse JSON for {var_name}: {e}")
        return content

for v in ['pt1_mathModule1', 'pt1_mathModule2', 'pt2_mathModule1', 'pt2_mathModule2']:
    ts_content = process_array(v, ts_content)

with open('src/data/questions.ts', 'w') as f:
    f.write(ts_content)

print("Updated questions.ts options!")
