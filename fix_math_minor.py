import re

with open('test1_questions.txt', 'r') as f:
    text = f.read()

# Replace " f(x) ", " (x,y) ", " x ", " y " etc in the math section
math_idx = text.find('### Section 2, Module 1: Math')
math_part = text[math_idx:]
english_part = text[:math_idx]

math_part = math_part.replace(' f(x) ', ' $f(x)$ ')
math_part = math_part.replace(' g(x) ', ' $g(x)$ ')
math_part = math_part.replace(' h(x) ', ' $h(x)$ ')
math_part = math_part.replace(' (x,y) ', ' $(x,y)$ ')
math_part = math_part.replace(' function f is', ' function $f$ is')
math_part = math_part.replace(' values of x does', ' values of $x$ does')

def wrap_choice(m):
    prefix = m.group(1)
    val = m.group(2).strip()
    if not val.startswith('$') and bool(re.search(r'[\+\-\=\<\>\\]|\d', val)) and not re.search(r'[A-Za-z]{4,}', val):
        return f"{prefix}${val}$"
    return m.group(0)

lines = math_part.split('\n')
for i, line in enumerate(lines):
    # wrap multiple choices that are just math but weren't wrapped
    lines[i] = re.sub(r'^([A-D]\.\s+)(.*)$', wrap_choice, lines[i])

math_part = '\n'.join(lines)

with open('test1_questions.txt', 'w') as f:
    f.write(english_part + math_part)

