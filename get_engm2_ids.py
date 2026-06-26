import re

with open('src/data/questions.ts', 'r') as f:
    text = f.read()

# Extract all IDs for EngM2
# They look like: id: "pt1_EngM2_1"
matches = re.findall(r'id:\s*"pt1_EngM2_(\d+)"', text)
print([int(m) for m in matches])
