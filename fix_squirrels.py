import re

with open('test2_questions.txt', 'r') as f:
    text = f.read()

# Fix squirrels options
bad_squirrels = """A. $N$ = 200(2.20)<i>
At

B. $N$ = 200(1.20)

C. $N$ = 200(1.20)#

b. $N$ = 200(2.20)#"""

good_squirrels = """A. $N = 200(2.20)^{4t}$

B. $N = 200(1.20)^{4t}$

C. $N = 200(1.20)^{\\frac{t}{4}}$

D. $N = 200(2.20)^{\\frac{t}{4}}$"""

text = text.replace(bad_squirrels, good_squirrels)

# ALSO fix ANY A. $...$ format to be proper.
# The user wants "A. $N = 200(2.20)^{4t}$" not "A. $N$ = 200... "
# The user wants exact practice test 1 math section format!
# Let's check practice test 1 choices.
# We saw:
# A. $7$
# B. $70$
# C. $130$
# D. $670$
# In PT1, the choices are fully wrapped in $$ if they are math expressions, e.g. A. $y=40(1.50)^{x}$
# Let's ensure PT2 choices are fully wrapped and NOT $A$. $B$. 
# 1. First fix $A$. to A., $B$. to B., $C$. to C., $D$. to D. in the whole file
text = re.sub(r'\$([A-D])\$\.', r'\1.', text)
text = re.sub(r'\$([A-D])\$\s+\.', r'\1.', text)

# Let's also look for b. instead of B.
text = re.sub(r'\nb\.\s+', '\nB. ', text)
text = re.sub(r'\nc\.\s+', '\nC. ', text)
text = re.sub(r'\nd\.\s+', '\nD. ', text)


with open('test2_questions.txt', 'w') as f:
    f.write(text)

