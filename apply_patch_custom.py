import re

with open('user.patch', 'r') as f:
    lines = f.readlines()

with open('test1_questions.txt', 'r') as f:
    text = f.read()

# We can parse the patch file into chunks of - lines and + lines.
hunks = []
current_hunk = None

for line in lines:
    if line.startswith('@@'):
        if current_hunk:
            hunks.append(current_hunk)
        current_hunk = {'minus': [], 'plus': []}
    elif current_hunk is not None:
        if line.startswith('-'):
            current_hunk['minus'].append(line[1:])
        elif line.startswith('+'):
            current_hunk['plus'].append(line[1:])
        elif line.startswith(' '):
            # context line
            # actually we don't strictly need context if we just match minus precisely
            pass

if current_hunk:
    hunks.append(current_hunk)

for h in hunks:
    minus_text = "".join(h['minus']).strip()
    plus_text = "".join(h['plus']).strip()
    if minus_text:
        # Some newlines might be slightly off. Let's just find `minus_text` in `text` and replace.
        if minus_text in text:
            text = text.replace(minus_text, plus_text)
        else:
            # try finding it with flexible newlines
            pass

with open('test1_questions.txt', 'w') as f:
    f.write(text)

