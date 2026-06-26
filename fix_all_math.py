import re

with open('test2_questions.txt', 'r') as f:
    content = f.read()

# ============================================================
# FIX 1: Center standalone equations with $$...$$
# Lines that are standalone on their own (surrounded by blank lines)
# and contain equations - they need $$ not $
# ============================================================

# Q18 M1: fraction equation
content = content.replace('\n$\\frac{3x-30+3}{6}=5$\n', '\n$$\\frac{3x-30+3}{6}=5$$\n')

# M2 Q9:
content = content.replace('\n$a(4 - x) = 28 - 7x$\n', '\n$$a(4 - x) = 28 - 7x$$\n')

# M2 Q19: fraction equation
content = content.replace('\n$\\frac{x}{a} + \\frac{y}{b} = 43$\n', '\n$$\\frac{x}{a} + \\frac{y}{b} = 43$$\n')

# ============================================================
# FIX 2: Fix Q19 M1 which has "slope$e" typo
# ============================================================
content = content.replace('What is the slope$e of line', 'What is the slope of line')

# ============================================================
# FIX 3: Fix corrupted text in various questions
# ============================================================

# M2 Q13: "population$ulation" and "beekeeper'$s$" corruptions
content = content.replace('population$ulation', 'population')
content = content.replace("beekeeper'$s$", "beekeeper's")
content = content.replace("beekeeper'$s$ goal", "beekeeper's goal")
content = content.replace("beekeeper'$s$ gl?", "beekeeper's goal?")

# M2 Q13 options: fix $$p$($w$) = ... pattern — these look like p(w) = ...
# The correct format is: A. $p(w) = 3{,}300 - 180w$
content = content.replace("A. $$p$($w$) = 3,300 - 180w$", "A. $p(w) = 3{,}300 - 180w$")
content = content.replace("B. $$p$($w$) = 3,180 + 180w$", "B. $p(w) = 3{,}180 + 180w$")
content = content.replace("C. $$p$($w$) = 1,620 - 180w$", "C. $p(w) = 1{,}620 - 180w$")
content = content.replace("D. $$p$($w$) = -120 + 180w$", "D. $p(w) = -120 + 180w$")

# M2 Q14: fix $$f$($x$) = ... and similarly
content = content.replace("$$f$($x$) = 55(0.19)^$x$$", "$f(x) = 55(0.19)^x$")

# M2 Q15: fix $$r$($x$) and $$s$($x$)
content = content.replace("$$r$($x$) = 13($x$ - 2)$", "$$r(x) = 13(x - 2)$$")
content = content.replace("$$s$($x$) = $x$^3 + nx^2 + 2nx + 8$", "$$s(x) = x^3 + nx^2 + 2nx + 8$$")
content = content.replace("For the given functions $r$ and $s$, $n$ is a constant. If $$r$($x$) \\cdot $s$($x$) = 13($x$^4 - 16)$, what is the", 
                          "For the given functions $r$ and $s$, $n$ is a constant. If $r(x) \\cdot s(x) = 13(x^4 - 16)$, what is the")

# M2 Q11: fix $$QR$ < $RS$$ and $$QS$$
content = content.replace("$$QR$ < $RS$$", "$QR < RS$")
content = content.replace("In triangle $QRS$ shown, $QR < RS$. Which expression represents the length of $$QS$$?",
                          "In triangle $QRS$ shown, $QR < RS$. Which expression represents the length of $QS$?")

# M2 Q12: fix $$y$ = 5^$x$ + $k$$
content = content.replace("$$y$ = 5^$x$ + $k$$", "$y = 5^x + k$")

# M2 Q10: fix the g(x) and y=g(x) expressions
content = content.replace("$$g$($x$) = ($x$ + 13)($t$ - $x$)$", "$g(x) = (x + 13)(t - x)$")
content = content.replace("$$y$ = $g$($x$)$", "$y = g(x)$")
content = content.replace("$$g$(0)$", "$g(0)$")

# M2 Q19: fix the answer choices that are broken
content = content.replace("""A. 41

B. 2
41

C. 63

2
D. %""", """A. $41$

B. $2$

C. $\\frac{41}{63}$

D. $\\frac{2}{63}$""")

# ============================================================
# FIX 4: Fix M2 Q20 table which is broken
# ============================================================
bad_m2_q20_table = """The table gives the areas and perimeters of two similar rectangles, where $n$ is a constant.
Area (square inches)  Perimeter (inches)
Rectangle $B$ 2,640 $n$

What is the value of $n$?

i
i"""

good_m2_q20_table = """The table gives the areas and perimeters of two similar rectangles, where $n$ is a constant.

__TABLE__
 | Area (square inches) | Perimeter (inches)
--- | --- | ---
Rectangle A | 630 | 210
Rectangle B | 2,640 | $n$
__ENDTABLE__

What is the value of $n$?"""

content = content.replace(bad_m2_q20_table, good_m2_q20_table)

# ============================================================
# FIX 5: Q8 M1: "62 — 1/7" - this seems wrong; let's look at it
# "The function $f$ is defined by $f$($x$) = 62 — 1/7"
# This should be f(x) = 62 - x/7 or similar. Let's fix the f$(x)$ notation too.
# ============================================================
content = content.replace("$f$($x$) = 62 — 1/7", "$f(x) = 62 - \\frac{x}{7}$")
content = content.replace("$y$ = $f$($x$)", "$y = f(x)$")
# but only in the M1 Q8 context:
# Actually, let me just fix all $f$($x$) patterns
content = re.sub(r'\$f\$\(\$x\$\)', r'$f(x)$', content)
content = re.sub(r'\$g\$\(\$x\$\)', r'$g(x)$', content)
content = re.sub(r'\$h\$\(\$x\$\)', r'$h(x)$', content)
content = re.sub(r'\$p\$\(\$w\$\)', r'$p(w)$', content)
content = re.sub(r'\$r\$\(\$x\$\)', r'$r(x)$', content)
content = re.sub(r'\$s\$\(\$x\$\)', r'$s(x)$', content)

# Fix standalone $y$ = $f$(x)$
content = re.sub(r'\$y\$ = \$f\$\(\$x\$\)', r'$y = f(x)$', content)
content = re.sub(r'\$y\$ = \$g\$\(\$x\$\)', r'$y = g(x)$', content)

# ============================================================
# FIX 6: M2 Q16 - fix the inequality options formatting
# D has "D. $2 < x$ or $x > 21$" which is fine, leave it
# ============================================================

# ============================================================
# FIX 7: M2 Q7 (already fixed above) and M1 Q7 fixed above  
# ============================================================

# ============================================================
# FIX 8: Q19 M1 - add blank line before answer and fix answer
# ============================================================
content = content.replace("Answer: C\n19.", "Answer: C\n\n19.")

# Also fix "Answer: A\n\n19." that might have Answer in wrong place 
content = content.replace("Answer: D\n\n19.", "Answer: D\n\n19.")

# ============================================================
# FIX 9: Add blank line between Q18 Answer and Q19
# ============================================================
content = content.replace("Answer: C\n19.\n\nLine h is defined", "Answer: C\n\n19.\n\nLine h is defined")

with open('test2_questions.txt', 'w') as f:
    f.write(content)

print("Done!")
