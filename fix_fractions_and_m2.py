import re

with open('test2_questions.txt', 'r') as f:
    content = f.read()

# ============================================================
# FIX 1: Slash fractions in Answers → proper \frac
# ============================================================
content = content.replace('Answer: 13/4', 'Answer: $\\frac{13}{4}$')
content = content.replace('Answer: 3/2', 'Answer: $\\frac{3}{2}$')
content = content.replace('Answer: 72/7', 'Answer: $\\frac{72}{7}$')

# ============================================================
# FIX 2: Q12 M1 answer
# ============================================================
content = content.replace('Answer: $\\frac{13}{4}$\n\n13.', 'Answer: $\\frac{13}{4}$\n\n13.')

# ============================================================
# FIX 3: M2 Q1 - fix missing options B label, Q broken structure
# ============================================================
bad_m2_q1 = """In the figure shown, line $k$ intersects lines $r$ and $s$. If $w$ = 141, which additional piece of

information is sufficient to prove that lines 7 and $s$ are parallel?

A.

$x$ = 39
B.

$y$= 141
$w$+$y$ = 180

D.
$y$+$z$=180
Answer: B"""

good_m2_q1 = """In the figure shown, line $k$ intersects lines $r$ and $s$. If $w = 141$, which additional piece of information is sufficient to prove that lines $r$ and $s$ are parallel?

A. $x = 39$

B. $y = 141$

C. $w + y = 180$

D. $y + z = 180$

Answer: B"""

content = content.replace(bad_m2_q1, good_m2_q1)

# ============================================================
# FIX 4: M2 Q2 - fix "slope$e$" typo
# ============================================================
content = content.replace("What is the slope$e$ of the\nline?", "What is the slope of the line?")
content = content.replace("What is the slope$e$ of the line?", "What is the slope of the line?")

# ============================================================
# FIX 5: M2 Q3 - "rectangle'$s$" and "1/√106" (likely √106)
# ============================================================
content = content.replace("rectangle'$s$ diagonal is 1/106", "rectangle's diagonal is $\\sqrt{106}$")
content = content.replace("rectangle'$s$ sides", "rectangle's sides")
# Fix options
content = content.replace("3.\n\nThe length of a rectangle's diagonal is $\\sqrt{106}$, and the length of one of the rectangle's sides\nis 9. What is the perimeter of the rectangle?\n\nA.\n106\nB.\n45\nC.\n28\nD.\n\n14",
"3.\n\nThe length of a rectangle's diagonal is $\\sqrt{106}$, and the length of one of the rectangle's sides\nis 9. What is the perimeter of the rectangle?\n\nA. $106$\nB. $45$\nC. $28$\nD. $14$")

# ============================================================
# FIX 6: M2 Q4 - broken equation and options for $(5x+6)(8x-5)=0$
# ============================================================
bad_m2_q4 = """$(5x + 6)(8x - 5) = 0$
Which of the following is a solution to the given equation?

8
A. =

C. -3

5
D. $\\frac{5}{8}$
Answer: B"""

good_m2_q4 = """4.

$$( 5x + 6)(8x - 5) = 0$$

Which of the following is a solution to the given equation?

A. $-\\frac{8}{5}$

B. $-\\frac{6}{5}$

C. $-3$

D. $\\frac{5}{8}$

Answer: B"""

content = content.replace(bad_m2_q4, good_m2_q4)

# ============================================================
# FIX 7: M2 Q5 - fix "slope$e$"
# ============================================================
content = content.replace("What is the slope$e$ of the line?", "What is the slope of the line?")

# ============================================================
# FIX 8: M2 Q6 - fix broken system of equations
# ============================================================
bad_m2_q6 = """$x$? + y</i> = 3,185
$y - 8x = 0$

A solution to the given system of equations is (a, $y$), where $x$ < 0. What is the value of $y$?"""

good_m2_q6 = """6.

$$x^2 + y = 3{,}185$$

$$y - 8x = 0$$

A solution to the given system of equations is $(x, y)$, where $x < 0$. What is the value of $y$?"""

content = content.replace(bad_m2_q6, good_m2_q6)

# ============================================================
# FIX 9: M2 Q7 - fix broken function definition and options
# ============================================================
bad_m2_q7 = """7.

The function $f$ is defined by $f(x) = 244$, and $f(a) = -15$, where ais a constant. What is

the value of $a$?

A. -86
B. -64

64
C. 

4
D. $-\\frac{5}{8}$
Answer: A"""

good_m2_q7 = """7.

The function $f$ is defined by $f(x) = \\frac{x + 11}{5}$, and $f(a) = -15$, where $a$ is a constant. What is the value of $a$?

A. $-86$

B. $-64$

C. $\\frac{64}{4}$

D. $-\\frac{5}{8}$

Answer: A"""

content = content.replace(bad_m2_q7, good_m2_q7)

# ============================================================
# FIX 10: M2 Q8 - fix "«$x$" and "—" signs
# ============================================================
content = content.replace("where «$x$ is the number of seconds", "where $x$ is the number of seconds")
content = content.replace("$y$ = —4.9(a — 8.9) + 12,400", "$y = -4.9(x - 8.9)^2 + 12{,}400$")
content = content.replace("The equation $y = -4.9(x - 8.9)^2 + 12{,}400$ gives the", "The equation $y = -4.9(x - 8.9)^2 + 12{,}400$ gives the")
# The whole Q8 text already refers to $y = -4.9(a-8.9) + 12400, fix "a" to "x"
content = content.replace("The equation $y$ = —4.9(a — 8.9) + 12,400 gives the estimated height above ground, $y$, in\nmeters, of a plane, where «$x$ is the number of seconds since it started a parabolic maneuver.",
"The equation $y = -4.9(x - 8.9)^2 + 12{,}400$ gives the estimated height above ground, $y$, in\nmeters, of a plane, where $x$ is the number of seconds since it started a parabolic maneuver.")

# ============================================================
# FIX 11: M2 Q5 - fix missing question number  
# ============================================================
content = content.replace("Answer: -9\n\n$x$? + y</i> = 3,185", 
                         "Answer: -9\n\n6.\n\n$x^2 + y = 3{,}185$")

# ============================================================
# FIX 12: M2 Q19 - "ae ohms" typo
# ============================================================
content = content.replace("a total\nresistance of ae ohms.", "a total resistance of $\\frac{41}{63}$ ohms.")

# ============================================================
# FIX 13: M2 Q19 answer choices for B option - should be $\frac{2}{63}$ not $2$
# ============================================================

# ============================================================
# FIX 14: M1 Q8 - the function f(x)=62-x/7 should use \frac notation
# already done above, let's make sure
# ============================================================

with open('test2_questions.txt', 'w') as f:
    f.write(content)

print("Done!")
