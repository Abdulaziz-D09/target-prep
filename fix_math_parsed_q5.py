import json

with open('math_parsed.json', 'r') as f:
    data = json.load(f)

# The user wants math module 1 question 5 to have tables in the answer choices exactly like pic5.
# Let's fix math_parsed.json Question 5 to include the proper tables.
for q in data['m1']:
    if q['num'] == 5:
        q['options'] = [
            "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 42\n2 | 44.1\n__ENDTABLE__",
            "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 44\n2 | 48.4\n__ENDTABLE__",
            "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 56\n2 | 78.4\n__ENDTABLE__",
            "__TABLE__\nx | y\n--- | ---\n0 | 40\n1 | 60\n2 | 90\n__ENDTABLE__"
        ]
        q['answer'] = 3

with open('math_parsed.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated question 5 options with tables in math_parsed.json.")
