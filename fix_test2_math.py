import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

math_idx = text.find('Section: Section 2, Module 1: Math')
if math_idx == -1:
    print("Could not find math section in test2")
    exit(1)

english_part = text[:math_idx]
math_part = text[math_idx:]

def replace_inline(m):
    val = m.group(1).strip()
    # if it's already wrapped, return it
    if val.startswith('$') and val.endswith('$'):
        return m.group(0)
    return f" ${val}$ "

# For test2, some equations are just lines like:
# y=9x + 19
# or inline: y = mx + b
lines = math_part.split('\n')
for i, line in enumerate(lines):
    s = line.rstrip()
    if s and not s.startswith('Section:') and not s.startswith('Answer:') and not re.match(r'^\d+\.$', s):
        # find standalone equations
        if re.match(r'^[A-D]\.\s*', s):
            # Multiple choice
            m = re.match(r'^([A-D]\.\s*)(.*)$', s)
            prefix, opt = m.group(1), m.group(2).strip()
            if not opt.startswith('$') and bool(re.search(r'[\+\-\=\<\>\\]|\d', opt)) and not re.search(r'[A-Za-z]{4,}', opt):
                lines[i] = f"{prefix}${opt}$"
        else:
            # Inline math that needs wrapping (simple heuristic for test2)
            # Find things like "5x + 2 = 32"
            def inline_replacer(match):
                expr = match.group(0)
                if not expr.startswith('$'):
                    return f"${expr}$"
                return expr
                
            # A bit dangerous to blindly regex, but we can look for specific patterns
            # Let's just wrap things that have =, <, >, \frac, \sqrt etc if they aren't words
            # Or better, we can replace common test2 math manually since there are only 44 questions.
            pass

with open('test2_questions.txt', 'w') as f:
    f.write(english_part + '\n'.join(lines))

print("Done")
