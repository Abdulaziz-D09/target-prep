import json

with open('src/data/questions.ts', 'r') as f:
    text = f.read()

# very rough extraction to see lengths
# just run a quick grep on the parsed file
