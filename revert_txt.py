import json

transcript_path = '/Users/abdulazizdavronov/.gemini/antigravity-ide/brain/7c34f905-039d-44db-8712-066c6e1aa2bc/.system_generated/logs/transcript.jsonl'
with open(transcript_path, 'r') as f:
    lines = f.readlines()

replacements = []
for line in lines:
    try:
        data = json.loads(line)
        if data.get('type') == 'PLANNER_RESPONSE':
            for call in data.get('tool_calls', []):
                if call['name'] in ['multi_replace_file_content', 'replace_file_content']:
                    args = call['args']
                    target_file = json.loads(args.get('TargetFile', '""'))
                    if 'test2_questions.txt' in target_file:
                        if 'ReplacementChunks' in args:
                            try:
                                chunks = json.loads(json.loads(args['ReplacementChunks']))
                            except:
                                chunks = json.loads(args['ReplacementChunks'])
                            for chunk in chunks:
                                replacements.append((chunk['TargetContent'], chunk['ReplacementContent']))
                        elif 'TargetContent' in args:
                            try:
                                replacements.append((json.loads(args['TargetContent']), json.loads(args['ReplacementContent'])))
                            except:
                                replacements.append((args['TargetContent'], args['ReplacementContent']))
    except Exception as e:
        print(f"Error parsing line: {e}")

with open('test2_questions.txt', 'r') as f:
    text = f.read()

count = 0
not_found = 0
for target, replacement in reversed(replacements):
    if replacement in text:
        text = text.replace(replacement, target)
        count += 1
    else:
        not_found += 1

print(f"Reverted {count} chunks. Missed {not_found} chunks.")

with open('test2_questions.txt', 'w') as f:
    f.write(text)
