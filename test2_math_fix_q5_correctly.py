import json

with open('test2_math.json', 'r') as f:
    data = json.load(f)

# Module 1 Question 5 options in the user's pic5
# Options should be tables matching what I just put into math_parsed.json
for test in data:
    for q in test['questions']:
        if q['id'] == 'pt2-math-m1-q5':
            q['options'] = [
                "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 42\n2 | 44.1\n__ENDTABLE__",
                "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 44\n2 | 48.4\n__ENDTABLE__",
                "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 56\n2 | 78.4\n__ENDTABLE__",
                "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 60\n2 | 90\n__ENDTABLE__"
            ]
            q['answer'] = 3

with open('test2_math.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated question 5 options with CORRECT tables.")
