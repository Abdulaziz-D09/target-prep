import re

with open('test1_questions.txt', 'r') as f:
    text = f.read()

math_index = text.find('### Section 2, Module 1: Math')
english_part = text[:math_index]
math_part = text[math_index:]

# specific strings we want to wrap
targets = [
    '(-5,y) , where',
    '(x,y)',
    '(x-16)(x-12)(x+9)(x+19)=0',
    '2x+y=11',
    '4\\pi',
    '58=2x+2y',
    '9x+4=67',
    '9x^{2}+8=nx',
    "A'B'C'",
    "A'B'C' . If the length of",
    'QR < RS . Which expression represents the length of',
    '\\frac{1}{2}x+\\frac{1}{9}y-54=0.',
    '\\frac{47}{45}',
    '\\frac{x}{5}+\\frac{y}{9}=\\frac{47}{45}',
    'b^{2}+4c=7d',
    'b_{\\prime} ,',
    'f(n)',
    'f(n-1)',
    'f(x)=3x-\\frac{1}{4} . What is the y-intercept of the graph of',
    'f(x)=56(0.19)^{x}.',
    'f(x)=\\frac{1}{8x} . What is the value of',
    'f(x)=\\frac{x+11}{5} , and',
    'f(x)\\cdot g(x)-h(x)=ax^{2}+bx+c_{r}',
    'h(t)=-16t^{2}+b',
    'n_{1}',
    'p\\%',
    't=0',
    'w=147,',
    'x<0',
    'x>0',
    'x^{2}+(\\sqrt{k-3})x+42=0',
    'x^{2}-\\frac{81}{16}=0',
    'x_{1}',
    'y=4x.',
    'y=f(x)',
    'y_{1}',
    '|4x-3|=-9'
]

# Manual specific replacements for the messed up ones
manual_replacements = {
    "A'B'C' . If the length of": "$A'B'C'$. If the length of",
    "QR < RS . Which expression represents the length of": "$QR < RS$. Which expression represents the length of",
    "f(x)=3x-\\frac{1}{4} . What is the y-intercept of the graph of": "$f(x)=3x-\\frac{1}{4}$. What is the y-intercept of the graph of",
    "f(x)=\\frac{1}{8x} . What is the value of": "$f(x)=\\frac{1}{8x}$. What is the value of",
    "f(x)=\\frac{x+11}{5} , and": "$f(x)=\\frac{x+11}{5}$, and",
    "h(x)=a^{x}+b , where a and b are positive constants. The graph of": "$h(x)=a^{x}+b$, where $a$ and $b$ are positive constants. The graph of",
    "(-5,y) , where": "$(-5,y)$, where",
    "b_{\\prime} ,": "$b_{\\prime}$,",
    "w=147,": "$w=147$,",
    "\\frac{1}{2}x+\\frac{1}{9}y-54=0.": "$\\frac{1}{2}x+\\frac{1}{9}y-54=0$.",
    "f(x)=56(0.19)^{x}.": "$f(x)=56(0.19)^{x}$.",
    "y=4x.": "$y=4x$.",
    "and d, where": "and $d$, where",
    "is 18, what is the length of": "is 18, what is the length of", # no change
    "when": "when" # no change
}

for target in targets:
    if target in manual_replacements:
        rep = manual_replacements[target]
        math_part = math_part.replace(f"  {target}  ", f" {rep} ")
    else:
        # standard wrap
        math_part = math_part.replace(f"  {target}  ", f" ${target}$ ")

# Replace common inline variables that missed the double spaces
math_part = re.sub(r'\b length x,', r' length $x$,', math_part)
math_part = re.sub(r'\b width y,', r' width $y$,', math_part)
math_part = re.sub(r'\bvariables x and y\b', r'variables $x$ and $y$', math_part)
math_part = re.sub(r'\bvariables and y\b', r'variables $x$ and $y$', math_part) # fix typo in original
math_part = math_part.replace('  x=0 ,', ' $x=0$,')
math_part = math_part.replace(' value of x by', ' value of $x$ by')
math_part = math_part.replace(' value of y is', ' value of $y$ is')
math_part = math_part.replace(' value of y increases', ' value of $y$ increases')
math_part = math_part.replace(' value of  90x+40: ', ' value of $90x+40$: ')
math_part = math_part.replace(' value of x?', ' value of $x$?')
math_part = math_part.replace('  x=9 ?', ' $x=9$? ')
math_part = math_part.replace('  x+6y=28 \n', ' $x+6y=28$ \n')
math_part = math_part.replace('\n 6y=14 \n', '\n $6y=14$ \n')
math_part = math_part.replace(' y=f(x)  in the', ' $y=f(x)$ in the')
math_part = math_part.replace('  f(x)=0 ?', ' $f(x)=0$? ')
math_part = math_part.replace('  c_{\\prime} ', ' $c_{\\prime}$ ')
math_part = math_part.replace(' d>\\frac{4}{7}c . Which equation', ' $d>\\frac{4}{7}c$. Which equation')
math_part = math_part.replace('  \\overline{AB}  is', ' $\\overline{AB}$ is')
math_part = math_part.replace(' length of  \\overline{A\'B\'} ?', ' length of $\\overline{A\'B\'}$? ')
math_part = math_part.replace('  (x+3)^{2}+(y+9)^{2}=361 ?', ' $(x+3)^{2}+(y+9)^{2}=361$? ')
math_part = math_part.replace('  5x-7y>35 ?', ' $5x-7y>35$? ')
math_part = math_part.replace('  a, 26, 29, b, 31, 47, с For the given', ' $a, 26, 29, b, 31, 47, с$. For the given')
math_part = math_part.replace('where a, b, and c are constants', 'where $a$, $b$, and $c$ are constants')
math_part = math_part.replace('value of c?', 'value of $c$?')
math_part = math_part.replace('  \\overline{QS} ?', ' $\\overline{QS}$? ')

# Replace lines that start with A. B. C. D. followed by math
def multiple_choice_replacer(m):
    prefix = m.group(1)
    expr = m.group(2).strip()
    if not expr.startswith('$'):
        if bool(re.search(r'[\+\=\<\>\\]|x\^|y\^', expr)) and not re.search(r'[a-zA-Z]{4,}', expr):
            return f"{prefix}${expr}$"
    return m.group(0)

lines = math_part.split('\n')
for i, line in enumerate(lines):
    lines[i] = re.sub(r'^([A-D]\.\s+)(.*?)$', multiple_choice_replacer, line)
    
    # Check standalone equation lines not covered
    s = lines[i].strip()
    if s and not s.startswith('**') and not s.startswith('###') and not re.match(r'^[A-D]\.', s) and not s.startswith('|') and not s.startswith('!['):
        if bool(re.search(r'[\+\=\<\>\\]', s)) and not re.search(r'[a-zA-Z]{4,}', s) and '?' not in s:
            if not s.startswith('$'):
                lines[i] = f"${s}$"

math_part = '\n'.join(lines)

with open('test1_questions.txt', 'w') as f:
    f.write(english_part + math_part)

