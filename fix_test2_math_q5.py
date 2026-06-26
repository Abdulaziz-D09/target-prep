import json

with open('test2_math.json', 'r') as f:
    data = json.load(f)

# The user wants math module 1 question 5 to have tables in the answer choices exactly like pic5.
# Let's fix test2_math.json Question 5 to include the proper tables.
for test in data:
    for q in test['questions']:
        if q['id'] == 'pt2-math-m1-q5':
            q['options'] = [
                "__TABLE__\nx | y\n--- | ---\n0 | 50\n1 | 20\n2 | 2\n__ENDTABLE__",
                "__TABLE__\nx | y\n--- | ---\n0 | 50\n1 | 70\n2 | 90\n__ENDTABLE__",
                "__TABLE__\nx | y\n--- | ---\n0 | 50\n1 | 75\n2 | 112.5\n__ENDTABLE__",
                "__TABLE__\nx | y\n--- | ---\n0 | 50\n1 | 100\n2 | 200\n__ENDTABLE__"
            ]
            q['answer'] = 2

with open('test2_math.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated question 5 options with tables.")
