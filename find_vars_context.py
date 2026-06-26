import re

with open('test1_questions.txt', 'r') as f:
    text = f.read()

math_idx = text.find('### Section 2, Module 1: Math')
if math_idx == -1:
    print("Could not find Math section")
    exit(1)

math_text = text[math_idx:]

# Find all single lowercase letters that are not enclosed in $ $ or < >
# To do this safely, we iterate over matches of \b[a-z]\b
for m in re.finditer(r'\b([a-z])\b', math_text):
    start = max(0, m.start() - 30)
    end = min(len(math_text), m.end() + 30)
    context = math_text[start:end]
    # check if inside $ $
    before = math_text[:m.start()]
    if before.count('$') % 2 == 1:
        continue
    # check if inside <i> </i>
    if before.rfind('<i>') > before.rfind('</i>'):
        continue
    
    # filter out words like "a" when it's clearly an article:
    # " a ", " a\n", "\na "
    word = m.group(1)
    if word == 'a':
        # we still want to see 'a' contexts to distinguish
        pass
    
    print(f"[{word}] -> ...{context.replace(chr(10), ' ')}...")
