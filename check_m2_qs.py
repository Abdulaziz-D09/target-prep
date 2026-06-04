import json

with open('pt1_english_full.json', 'r') as f:
    data = json.load(f)

m2 = data[1]['questions']
nums = [q['num'] for q in m2]

missing = [i for i in range(1, 28) if i not in nums]
print("Missing in M2:", missing)
