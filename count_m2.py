import re

with open('src/data/questions.ts', 'r') as f:
    text = f.read()

count = len(re.findall(r'"testId":\s*"pt1",\s*"module":\s*"m2",\s*"section":\s*"english"', text))
print(f"EngM2 count: {count}")
