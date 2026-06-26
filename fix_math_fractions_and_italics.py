import json
import re

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

def find_issues():
    issues = []
    for m in data:
        for q in m['questions']:
            text = q.get('passage', '') + " " + q.get('question', '') + " " + " ".join(q.get('options', []))
            if '<i>' in text or '<em>' in text:
                issues.append(f"Q{q['num']}: {text}")
    return issues

print("Items with <i> or <em> tags:")
for i in find_issues():
    print(i)

