import json
import re

with open('pt1_english_full.json', 'r') as f:
    data = json.load(f)

with open('src/data/questions.ts', 'r') as f:
    ts_content = f.read()

def replace_array(var_name, new_questions, ts_content):
    new_arr_str = json.dumps(new_questions, indent=4)
    # The JSON array doesn't match the TS structure perfectly. 
    # For instance, `passage` might be undefined in `questions.ts` for some questions?
    # Wait, `parse_pt1_english_new.py` doesn't split the question and the passage!
    pass
