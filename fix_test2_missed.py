import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

math_idx = text.find('Section: Section 2, Module 1: Math')
english_part = text[:math_idx]
math_part = text[math_idx:]

replacements = {
    "y=9x + 19": "$y=9x + 19$",
    "y = mx + b, where m and b are": "$y = mx + b$, where $m$ and $b$ are",
    "lf 5x + 2 = 32, what is the value of 50x + 20?": "If $5x + 2 = 32$, what is the value of $50x + 20$?",
    "x+y= 165": "$x+y= 165$",
    "x+y+y=185": "$x+y+y=185$",
    "y = f(x) in the xy-plane?": "$y = f(x)$ in the $xy$-plane?",
    "a(4 - x) = 28 - 7x": "$a(4 - x) = 28 - 7x$"
}

for k, v in replacements.items():
    math_part = math_part.replace(k, v)

with open('test2_questions.txt', 'w') as f:
    f.write(english_part + math_part)

