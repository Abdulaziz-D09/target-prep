import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Split into English and Math sections
math_idx = text.find('Section: Section 2, Module 1: Math')
english_part = text[:math_idx]
math_part = text[math_idx:]

# --- FIX IMAGES ---
math_part = math_part.replace(
'''Annual sales
(in millions of dollars)

Square footage of store
(in thousands of square feet)''', 
'''![Graph](/pt2/m1-q6.png)''')

math_part = math_part.replace(
'''Note: Figure not drawn to scale.

In the figure shown, lines <<i>l</i>> and <<i>k</i>> are parallel''',
'''Note: Figure not drawn to scale.

![Graph](/pt2/m1-q10.png)

In the figure shown, lines <<i>l</i>> and <<i>k</i>> are parallel''')

math_part = math_part.replace(
'''tL

[}<u>1</u>+_1__1___1__}<u> 1} 1} 1} 1
32 34 36 38 40 42 44 46 48 50
Shoal bass length (cm)''',
'''![Graph](/pt2/m1-q13.png)''')

math_part = math_part.replace(
'''A LI C
10 cm

Note: Figure not drawn to scale.''',
'''![Graph](/pt2/m1-q14.png)

Note: Figure not drawn to scale.''')

math_part = math_part.replace(
'''The graph of <i>y= f(x)</i>  is shown in the xy-plane. For what value of <i>x</i> does f(x) = 0?''',
'''![Graph](/pt2/m1-q17.png)

The graph of $y= f(x)$ is shown in the xy-plane. For what value of $x$ does $f(x) = 0$?''')

math_part = math_part.replace(
'''NotA . iguH\\not dHiwn to scalA''',
'''Note: Figure not drawn to scale.

![Graph](/pt2/m2-q1.png)''')

math_part = math_part.replace(
'''s 23
Note: Figure not drawn to scale.''',
'''![Graph](/pt2/m2-q11.png)

Note: Figure not drawn to scale.''')

math_part = math_part.replace(
'''10

NA+ OA 0

The graph of the equation $y = 5^x + k$ is shown''',
'''![Graph](/pt2/m2-q12.png)

The graph of the equation $y = 5^x + k$ is shown''')


# --- FIX MATH OCR ERRORS ---
replacements = {
    "x^2 — 2x = 29": "$x^2 - 2x = 29$",
    "A. sqrt29": "A. $\\sqrt{29}$",
    "B. 1 + sqrt30": "B. $1 + \\sqrt{30}$",
    "D. 29 + sqrt2": "D. $29 + \\sqrt{2}$",
    "Circle A in the xy-plane has the equation (x + 8)^2 + (y — 8)^2 = 25.": "Circle A in the xy-plane has the equation $(x + 8)^2 + (y - 8)^2 = 25$.",
    "defining circle B in the xy-plane is (x + 8)^2 + (y — 8)^2 = k": "defining circle B in the xy-plane is $(x + 8)^2 + (y - 8)^2 = k$",
    "|3x-30|+3/6=5": "$\\frac{|3x-30|+3}{6}=5$",
    "y?(a — 9) — 36(a — 9)°": "$y^2(x - 9) - 36(x - 9)^3$",
    "A. y(z — 9)": "A. $y(x - 9)$",
    "B. (x — 9)(x — 6)": "B. $(x - 9)(x - 6)$",
    "C. y+x-9": "C. $y + x - 9$",
    "C. y+x—9": "C. $y + x - 9$",
    "C. y+ax—9": "C. $y + x - 9$",
    "D. y+ 6x — 54": "D. $y + 6x - 54$",
    "92 + y = 16": "$9x + y = 16$",
    "x? + y* = 3,185": "$x^2 + y^2 = 3,185$",
    "y— 8x =0": "$y - 8x = 0$",
    "A. —392": "A. -392",
    "B. —56": "B. -56",
    "Cc. —8": "C. -8",
    "D. —7": "D. -7",
    "f(z) = 244": "$f(x) = 244$",
    "f(a) = —15": "$f(a) = -15$",
    "A. —86": "A. -86",
    "B. —64": "B. -64",
    "a(4 — x) = 28 — 7x": "$a(4 - x) = 28 - 7x$",
    "g(x) = (x + 13)(t - x)": "$g(x) = (x + 13)(t - x)$",
    "y = g(x)": "$y = g(x)$",
    "(24, 0)": "$(24, 0)$",
    "g(0)": "$g(0)$",
    "QR < RS": "$QR < RS$",
    "QS": "$QS$",
    "y = 5^x + k": "$y = 5^x + k$",
    "A. —8": "A. -8",
    "B. —7": "B. -7",
    "p(w) = 3,300 - 180w": "$p(w) = 3,300 - 180w$",
    "p(w) = 3,180 + 180w": "$p(w) = 3,180 + 180w$",
    "p(w) = 1,620 - 180w": "$p(w) = 1,620 - 180w$",
    "p(w) = -120 + 180w": "$p(w) = -120 + 180w$",
    "f(x) = 55(0.19)^x": "$f(x) = 55(0.19)^x$",
    "r(x) = 13(x - 2)": "$r(x) = 13(x - 2)$",
    "s(x) = x^3 + nx^2 + 2nx + 8": "$s(x) = x^3 + nx^2 + 2nx + 8$",
    "r(x) \\cdot s(x) = 13(x^4 - 16)": "$r(x) \\cdot s(x) = 13(x^4 - 16)$",
    "A. xz < 21": "A. $x < 21$",
    "B. xz > 21": "B. $x > 21$",
    "C.1l<a2< 21": "C. $1 < x < 21$",
    "D.2<lorz> 21": "D. $2 < x$ or $x > 21$",
    "(9, 1), (0, 8), and (c, 0)": "$(9, 1)$, $(0, 8)$, and $(c, 0)$",
    "zy y _ Al\\n7 +9 = $3": "$\\frac{x}{a} + \\frac{y}{b} = 43$",
    "zy y _ Al": "",
    "7 +9 = $3": "$\\frac{x}{a} + \\frac{y}{b} = 43$",
    "zy y </u> Al": "",
    "y?(a — 9) — 36(a — 9)°": "$y^2(x - 9) - 36(x - 9)^3$",
    "A. —4": "A. -4",
    "B. 0": "B. 0",
    "Cc. 1": "C. 1",
    "D. 4": "D. 4",
    "A. —": "A. ",
    "rolor": "$-\\frac{5}{2}$",
    "B. —": "B. ",
    "ofr": "$-\\frac{2}{5}$",
    "Cc.": "C.",
    "dolor": "$\\frac{5}{2}$",
    "D.": "D.",
    "op": "$\\frac{2}{5}$",
    "(5a + 6)(8a — 5) =0": "$(5x + 6)(8x - 5) = 0$",
    "A. —=": "A. $-\\frac{6}{5}$",
    "is)": "",
    "|": "",
    "oa": "",
    "c. —3": "C. -3",
    "D. se": "D. $\\frac{5}{8}$",
    "A. \\n106": "A. 106",
    "B. \\n45": "B. 45",
    "C. \\n28": "C. 28",
    "D. \\n14": "D. 14",
    "c, —": "C. ",
    "D. —=": "D. $-\\frac{5}{8}$",
}

for k, v in replacements.items():
    if v == "":
        math_part = math_part.replace(k + "\n", "")
        math_part = math_part.replace(k, "")
    else:
        math_part = math_part.replace(k, v)

# Re-assemble and write back
with open('test2_questions.txt', 'w') as f:
    f.write(english_part + math_part)

print("test2_questions.txt math & images patched.")
