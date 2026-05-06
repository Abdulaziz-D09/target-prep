import json

with open('pdf_extractor/parsed_questions.json', 'r') as f:
    data = json.load(f)

for i in range(10):
    print(f"Q{i+1}: {data[i]['question']}")
