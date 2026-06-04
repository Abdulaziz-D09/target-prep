import json

log_file = '/Users/abdulazizdavronov/.gemini/antigravity/brain/eb820f58-573a-4c68-90fe-bf5e8587282c/.system_generated/logs/transcript.jsonl'
last_user_msg = ""

with open(log_file, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                last_user_msg = data.get('content', '')
        except:
            pass

with open('test1_questions.txt', 'w') as f:
    f.write(last_user_msg)

print("Extracted to test1_questions.txt")
