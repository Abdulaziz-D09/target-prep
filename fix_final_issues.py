import re

with open('test2_questions.txt', 'r') as f:
    content = f.read()

# 1. Remove "Note: Figure not drawn to scale." everywhere
content = content.replace("Note: Figure not drawn to scale.", "")
content = content.replace("Note: Figure not drawn to scale. ", "")

# 2. Fix the power formatting in Q22
# The user wants "even in power the fractions need to work"
# Instead of N = 200(1.20)^{t/4}, it needs to be N = 200(1.20)^{\frac{t}{4}}
content = content.replace("N = 200(1.20)^{t/4}", "N = 200(1.20)^{\\frac{t}{4}}")
content = content.replace("N = 200(2.20)^{t/4}", "N = 200(2.20)^{\\frac{t}{4}}")

# 3. Add line over QS in pic2 (M2 Q11)
content = content.replace("length of $QS$?", "length of $\\overline{QS}$?")

# 4. Fix Q18 again
# The user said: "question 18 has |3x-30| not just blank"
# Let's check what Q18 has right now. In my previous fix I put:
# $$\frac{|3x - 30| + 3}{6} = 5$$
# Let's see if the user is talking about M1 Q18 or M2 Q18.
# M1 Q18 was: $$\frac{|3x - 30| + 3}{6} = 5$$
# If they see "blank", maybe the parser didn't like the \frac inside the $$ ?
# Or maybe they're talking about the text of the question?
# "question 18 has |3x-30| not just blank" - let's make sure the equation is formatted so KaTeX renders it.
# Maybe the parser ate the equation because of the $$ $$?
# Let's look at parser_all.py to see how it handles $$ equations.

with open('test2_questions.txt', 'w') as f:
    f.write(content)
