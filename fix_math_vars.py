import re

with open('test1_questions.txt', 'r') as f:
    text = f.read()

math_idx = text.find('### Section 2, Module 1: Math')
if math_idx == -1:
    print("Could not find Math section")
    exit(1)

pre_math = text[:math_idx]
math_text = text[math_idx:]

# 1. Replace <i>...</i> with $...$
math_text = re.sub(r'<i>([a-zA-Z])</i>', r'$\1$', math_text)

# 2. Fix xy-plane
math_text = re.sub(r'\bxy-plane\b', r'$xy$-plane', math_text)

# 3. Fix unitalicized variables: x, y, b, f, k, h, p, n, r, t, s, u, j, c, d, g, m, w, z
# We must NOT replace A, B, C, D (options)
# We must NOT replace 'a' when it is an article.
# Let's write a function to check if 'a' is an article
def is_article(match):
    # If preceded by certain words or followed by certain words
    return False

# For most letters, if they are standalone, they are variables.
# Letters to wrap:
letters = "bcdefghjklmnopqrstuvwxyz"

# We replace \b(letter)\b if it's not inside $ $ and not inside a word.
# We can do this by splitting the text by $...$ and only replacing in the text parts.
parts = re.split(r'(\$.*?\$)', math_text)
for i in range(0, len(parts), 2):
    # This is a non-math part
    part = parts[i]
    
    # Wrap specific letters
    part = re.sub(r'\b([' + letters + r'])\b', r'$\1$', part)
    
    # Also wrap 'a' if it's in a list like "a, b, c" or "a constant" 
    # Actually, let's just find "where a, b, and c are constants"
    part = re.sub(r'\ba,\b', r'$a$,', part)
    # What about standalone 'a' that means constant? e.g. "where a is a constant"
    part = re.sub(r'\bwhere a is\b', r'where $a$ is', part)
    part = re.sub(r'\bwhere a and\b', r'where $a$ and', part)
    
    # Also wrap function names like f(x) -> $f(x)$ if not already
    part = re.sub(r'\b([fgh])\((x|t)\)', r'$\1(\2)$', part)

    # Let's fix some specific cases:
    part = re.sub(r'\b(y)\s*>', r'$\1$>', part)
    part = re.sub(r'\b(y)\s*<', r'$\1$<', part)
    part = re.sub(r'\b(x)\s*>', r'$\1$>', part)
    part = re.sub(r'\b(x)\s*<', r'$\1$<', part)

    parts[i] = part

math_text = "".join(parts)

# Now, save back
with open('test1_questions.txt', 'w') as f:
    f.write(pre_math + math_text)

print("Done")
