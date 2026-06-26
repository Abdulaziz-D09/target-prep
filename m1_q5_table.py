import json

with open('test2_parsed.json', 'r') as f:
    data = json.load(f)

# The user wants tables for answer choices in Math M1 Q5!
# "pic5 is math section module 1 question. 5 for the answer choices make the same kinds of tables that are shown in the pic5"
# Math M1 is index 2.
q5 = data[2]['questions'][4]  # Q5 is index 4
print("Math M1 Q5:")
print(json.dumps(q5, indent=2))

