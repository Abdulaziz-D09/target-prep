import json
import re

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

for m in data:
    for q in m['questions']:
        if q.get('passage'):
            q['passage'] = re.sub(r'^\s*\d+[\.\)]\s*', '', q['passage'])
        if q.get('question'):
            q['question'] = re.sub(r'^\s*\d+[\.\)]\s*', '', q['question'])
        if q.get('options'):
            for i, opt in enumerate(q['options']):
                q['options'][i] = re.sub(r'^\s*\d+[\.\)]\s*', '', opt)

with open('test2_parsed.json', 'w') as f:
    json.dump(data, f, indent=2)

with open('test2_reading.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed numbers")
